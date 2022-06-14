import { useSession, signIn } from "next-auth/react";
import { api } from "../../services/api";
import { useRouter } from "next/router";
import { getStripeJs } from "../../services/stripe-js";
import style from "./styles.module.scss";

interface ISubscribeButton {
	priceId: string;
}

export function SubscribeButton({ priceId }: ISubscribeButton) {
	const { status, data } = useSession();
	const router = useRouter();

	const handleSubscribe = async () => {
		if (status !== "authenticated") {
			signIn("github");
			return;
		}

		if (data.activeSubscription) {
			router.push("/posts")
			return;
		}

		try {
			const response = await api.post("/subscribe");
			const stripe = await getStripeJs();

			await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<button className={style.container} type="button" onClick={handleSubscribe}>
			Subscribe now
		</button>
	);
}