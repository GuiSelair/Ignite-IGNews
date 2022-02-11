import { SignInButton } from "./SignInButton";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <img alt="ig.news" src="/images/logo.svg"/>
        <nav>
          <a className={styles.active} href="">Home</a>
          <a href="">Posts</a>
        </nav>

        <SignInButton/>
      </div>
    </header>
  );
}