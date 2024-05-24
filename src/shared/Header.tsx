import { Link } from "react-router-dom";

import ExternalLinks from "./ExternalLinks";
import styles from "./Header.module.css";
import AnimationToggle from "./AnimationToggle";

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
            tabIndex={0}
            onClick={() => {
              props.onMenuButtonPressed ? props.onMenuButtonPressed() : null;
            }}
            // prettier-ignore
            onKeyDown={(event) => {if (event.key == "Enter") {props.onMenuButtonPressed ? props.onMenuButtonPressed() : null;}}}
          />
        ) : null}
        <Link
          to={props.returnButtonTo ?? "/"}
          className={styles.homelink}
          title={`Return to ${props.returnButtonTitle ?? "Beastieball Info Home"}`}
        >
          <div className={styles.homeicon}></div>
        </Link>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.animationtogglecontainer}>
          <AnimationToggle break={true} />
        </div>
        <div className={styles.externallinkcontainer}>
          <ExternalLinks />
        </div>
      </div>
      <div className={styles.staticheader}></div>
    </>
  );
}
