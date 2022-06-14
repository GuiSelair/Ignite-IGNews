import { GetServerSideProps } from 'next'
import { asText as PrismicHelperAsText, asHTML as PrimicHelperAsHTML } from "@prismicio/helpers";
import { getSession } from 'next-auth/react'
import React from 'react'
import Head from 'next/head';

import { IPost } from '.';
import { createPrismicClient } from '../../../prismicio'

import styles from "./post.module.scss";

interface IWrapperPost {
	post: Omit<IPost, "excerpt">
}

export default function Post({ post }: IWrapperPost) {
	return (
		<>
			<Head>
				<title>{post.title} | Ignews</title>
			</Head>

			<main className={styles.container}>
				<article className={styles.post}>
					<h1>{post.title}</h1>
					<time>{post.updatedAt}</time>
					<div
						className={styles.postContent}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</article>
			</main>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
	const { slug } = params;
	const session = await getSession({
		req
	});
	console.log(session)

	if (!session.activeSubscription) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const prismic = createPrismicClient({
		req
	});

	const post = await prismic.getByUID("post", String(slug));

	return {
		props: {
			post: {
				slug: post.uid,
				title: PrismicHelperAsText(post.data.title),
				content: PrimicHelperAsHTML(post.data.content),
				updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
					day: "2-digit",
					month: "long",
					year: "numeric"
				})
			}
		}
	}
}