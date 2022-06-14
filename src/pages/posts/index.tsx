import { GetStaticProps } from "next";
import Head from "next/head";
import { asText as PrismicHelperAsText } from "@prismicio/helpers";
import Link from "next/link";

import { createPrismicClient } from "../../../prismicio";

import styles from "./styles.module.scss";

export type IPost = {
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	updatedAt: string;
}
interface IPosts {
	posts: Omit<IPost, "content">[];
}

export default function Posts({ posts }: IPosts) {
	return (
		<>
			<Head>
				<title>Posts | Ignews</title>
			</Head>

			<main className={styles.container}>
				<div className={styles.posts}>
					{posts.map(post => (
						<Link key={post.slug} href={`/posts/${post.slug}`}>
							<a>
								<time>{post.updatedAt}</time>
								<strong>{post.title}</strong>
								<p>{post.excerpt}</p>
							</a>
						</Link>
					))}
				</div>
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const prismic = createPrismicClient();

	const response = await prismic.getAllByType("post", {
		fetch: ["post.title", "post.content"],
		pageSize: 100,
	});

	const posts = response.map((post) => {
		return {
			slug: post.uid,
			title: PrismicHelperAsText(post.data.title),
			excerpt: post.data.content.find(postContent => postContent.type === "paragraph")?.text ?? "",
			updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: "long",
				year: "numeric"
			})
		};
	});

	return {
		props: {
			posts,
		},
	};
};
