import { Link } from "react-router-dom";

import NavIcons from "./NavIcons";
import styles from "./Header.module.css";

type Props = {
  title: string | undefined;
  menuButton?: boolean;
  menuButtonState?: boolean;
  onMenuButtonPressed?: () => void;
  returnButtonTo?: string;
  returnButtonTitle?: string;
};

export default function Header(props: Props): React.ReactNode {
  return (
    <>
      <div className={styles.header}>
        {props.menuButton ? (
          <img
            className={
              props.menuButtonState ? styles.toggleicon : styles.toggleiconOff
            }
            src={"/gameassets/sprOptions_small_0.png"}
            title={props.menuButtonState ? "Enable Menu" : "Disable Menu"}
            alt={props.menuButtonState ? "Enable Menu" : "Disable Menu"}
            aria-haspopup="menu"
            role="button"
            tabIndex={0}
            onClick={props.onMenuButtonPressed}
            // prettier-ignore
            onKeyDown={(event) => {if (event.key == "Enter" && props.onMenuButtonPressed) {props.onMenuButtonPressed()}}}
          />
        ) : null}
        <Link
          to={props.returnButtonTo ?? "/"}
          className={styles.homelink}
          title={`Return to ${props.returnButtonTitle ?? `${import.meta.env.VITE_BRANDING} Home`}`}
        >
          <div className={styles.homeicon}></div>
        </Link>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.externallinkcontainer}>
          <NavIcons />
        </div>
      </div>
      <div className={styles.staticheader}></div>
    </>
  );
}
