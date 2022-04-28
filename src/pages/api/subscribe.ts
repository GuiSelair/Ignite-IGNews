import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";

import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";

type IFaunaUser = {
    ref: {
        id: string;
    },
    data: {
        stripe_customer_id?: string;
    }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST"){
        const nextAuthSession = await getSession({ req: request });

        const faunaUser = await fauna.query<IFaunaUser>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(nextAuthSession.user.email)
                )
            )
        );

        let customer_id = faunaUser.data.stripe_customer_id;

        if (!customer_id){
            const stripeCheckoutCustomer = await stripe.customers.create({
                name: nextAuthSession.user.name,
                email: nextAuthSession.user.email
            });
            customer_id = stripeCheckoutCustomer.id;

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), faunaUser.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCheckoutCustomer.id
                        }
                    }
                )
            )
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            cancel_url: `${process.env.FRONTEND_URL}/`,
            success_url: `${process.env.FRONTEND_URL}/posts`,
            line_items: [{
                price: "price_1KtcHkK9GR4ePfDXTuSatuFO",
                quantity: 1
            }],
            mode: "subscription",
            payment_method_types: ["card"],
            billing_address_collection: "required",
            allow_promotion_codes: true,
            customer: customer_id,
        });

        return response.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
        response.setHeader("Allow", "POST");
        response.status(405).end("Method not allowed");
    }
}