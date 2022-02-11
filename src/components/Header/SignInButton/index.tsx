import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import style from "./styles.module.scss";

export function SignInButton() {
  const isUserLoggedIn = true;

  return isUserLoggedIn ? (
    <button className={style.container} type="button">
      <FaGithub color="#04d361"/>
      Guilherme Selair
      <FiX color="#737380" className={style.closeIcon}/>
    </button>
  ) : (
    <button className={style.container} type="button">
      <FaGithub color="#eba417"/>
      Sign in with Github
    </button>
  );
}