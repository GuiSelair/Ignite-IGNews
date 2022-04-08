import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import style from "../styles/home.module.scss";

interface IHome {
  product: {
    priceId: string;
    amount: number
  }
}

export default function Home({ product }: IHome) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>  
      </Head>  
      <main className={style.container}>
        <section className={style.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KmLz1L8PWHCJZAmWdmtkJcg");
  
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency"
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 //24 hours 
  }
};