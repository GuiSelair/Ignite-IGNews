import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";

import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscriptions";

async function buffer (readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        )
    }

    return Buffer.concat(chunks);
};

export const config = {
    api: {
        bodyParser: false
    }
};

const relevantEvents = new Set([
    "checkout.session.completed",
    "customer.subscriptions.created",
    "customer.subscriptions.updated",
    "customer.subscriptions.deleted",
]);

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const buf = await buffer(request);
        const stripeSignature = request.headers["stripe-signature"];
        
        let event: Stripe.Event;
        
        try {
            event = stripe.webhooks.constructEvent(buf, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET);        
        } catch(error) {
            return response.status(400).send(`Webhook error: ${error.message}`);
        }

        const { type } = event;

        if (relevantEvents.has(type)){
            try {
                switch (type) {
                    case"customer.subscriptions.created":
                    case"customer.subscriptions.updated":
                    case"customer.subscriptions.deleted":
                        break;
                    case "checkout.session.completed":
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;

                        await saveSubscription({
                            subscriptionId: checkoutSession.subscription.toString(),
                            customerID: checkoutSession.customer.toString()
                        });

                        break;
                    default:
                        throw new Error("Unhandled event.");
                }
            } catch (error) {
                return response.json({ error: "Webhook handler failed." });
            }
        }

        return response.json({ received: true });
    
    } else {
        response.setHeader("Allow", "POST");
        response.status(405).end("Method not allowed");
    }
};