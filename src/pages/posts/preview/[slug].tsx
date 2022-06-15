import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { asText as PrismicHelperAsText, asHTML as PrimicHelperAsHTML } from "@prismicio/helpers";
import { getSession, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import Head from 'next/head';

import { IPost } from '..';
import { createPrismicClient } from '../../../../prismicio'

import styles from "../post.module.scss";
import Link from 'next/link';
import { useRouter } from 'next/router';

interface IPreviewPost {
	post: Omit<IPost, "excerpt">
}

export default function PreviewPost({ post }: IPreviewPost) {
	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.activeSubscription) {
			router.push(`/posts/${post.slug}`)
		}
	}, [session]);

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
						className={`${styles.postContent} ${styles.previewPostContent}`}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
				</article>
				<div className={styles.continueReading}>
					Wanna continue reading?
					<Link href="/">
						<a>Subscribe now 🤗</a>
					</Link>
				</div>
			</main>
		</>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params;

	const prismic = createPrismicClient();
	const post = await prismic.getByUID("post", String(slug));

	return {
		props: {
			post: {
				slug: post.uid,
				title: PrismicHelperAsText(post.data.title),
				content: PrimicHelperAsHTML(post.data.content.splice(0, 3)),
				updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
					day: "2-digit",
					month: "long",
					year: "numeric"
				})
			}
		}
	}
}
