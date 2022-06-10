import { SignInButton } from "./SignInButton";
import { ActiveLink } from "../ActiveLink";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <img alt="ig.news" src="/images/logo.svg"/>
        <nav>
					<ActiveLink href="/" activeClassName={styles.active}>
          	<a>Home</a>
					</ActiveLink>
					<ActiveLink href="/posts" activeClassName={styles.active}>
          	<a>Posts</a>
					</ActiveLink>
        </nav>

        <SignInButton/>
      </div>
    </header>
  );
}