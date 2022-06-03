import { AppProps } from "next/app";
import Link from "next/link";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { linkResolver, repositoryName } from "../../prismicio";

import { Header } from "../components/Header";
import "../styles/global.scss";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<NextAuthProvider session={session}>
			<PrismicProvider
				linkResolver={linkResolver}
				internalLinkComponent={({ href, children, ...props }): any => {
					<Link href={href}>
						<a {...props}>{children}</a>
					</Link>;
				}}
			>
				<PrismicPreview repositoryName={repositoryName}>
					<Header />
					<Component {...pageProps} />
				</PrismicPreview>
			</PrismicProvider>
		</NextAuthProvider>
	);
}

export default MyApp;
