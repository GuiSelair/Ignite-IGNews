import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, useSession, signOut } from "next-auth/react";
import style from "./styles.module.scss";

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button className={style.container} type="button">
      <FaGithub color="#04d361"/>
      {session.user.name}
      <FiX color="#737380" className={style.closeIcon} onClick={() => signOut()}/>
    </button>
  ) : (
    <button className={style.container} type="button" onClick={() => signIn("github")}>
      <FaGithub color="#eba417"/>
      Sign in with Github
    </button>
  );
}