import style from "./styles.module.scss";

interface ISubscribeButton {
  priceId: string;
}

export function SubscribeButton({ priceId }: ISubscribeButton) {
  return (
    <button className={style.container} type="button">
      Subscribe now
    </button>
  );
}