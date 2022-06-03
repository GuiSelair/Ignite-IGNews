import { GetStaticProps } from "next";
import Head from "next/head";
import { createClient } from "../../../prismicio";

import styles from "./styles.module.scss";

export default function Posts() {
	return (
		<>
			<Head>
				<title>Posts | Ignews</title>
			</Head>

			<main className={styles.container}>
				<div className={styles.posts}>
					<a href="#">
						<time>12 de março de 2021</time>
						<strong>Teste</strong>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
							quas officia dignissimos nesciunt impedit nulla at, pariatur vel
							quasi quos enim. Laborum mollitia pariatur provident libero
							exercitationem ab debitis similique!
						</p>
					</a>
					<a href="#">
						<time>12 de março de 2021</time>
						<strong>Teste</strong>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
							quas officia dignissimos nesciunt impedit nulla at, pariatur vel
							quasi quos enim. Laborum mollitia pariatur provident libero
							exercitationem ab debitis similique!
						</p>
					</a>
					<a href="#">
						<time>12 de março de 2021</time>
						<strong>Teste</strong>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
							quas officia dignissimos nesciunt impedit nulla at, pariatur vel
							quasi quos enim. Laborum mollitia pariatur provident libero
							exercitationem ab debitis similique!
						</p>
					</a>
				</div>
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const prismic = createClient();

	const response = await prismic.getAllByType("post", {
		fetch: ["post.title", "post.content"],
		pageSize: 100,
	});

	const posts = response.map((post) => {
		return {
			slug: post.uid,
		};
	});

	return {
		props: {
			posts: response,
		},
	};
};
