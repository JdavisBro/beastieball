import { Link } from "react-router-dom";

import ExternalLinks from "./ExternalLinks";
import arrow from "../assets/arrow.svg";
import home from "../assets/home.svg";
import styles from "./Header.module.css";
import AnimationToggle from "./AnimationToggle";

type Props = {
  title: string | undefined;
  menuButton?: boolean;
  menuButtonState?: boolean;
  onMenuButtonPressed?: () => void;
};

export default function Header(props: Props): React.ReactNode {
  return (
    <div className={styles.header}>
      {props.menuButton ? (
        <img
          className={
            props.menuButtonState
              ? `${styles.toggleicon} ${styles.toggleiconvisible}`
              : styles.toggleicon
          }
          src={arrow}
          title={
            props.menuButtonState ? "Enable Menu Arrow" : "Disable Menu Arrow"
          }
          alt={
            props.menuButtonState ? "Enable Menu Arrow" : "Disable Menu Arrow"
          }
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
        to="/"
        className={styles.homelink}
        title="Return to Beastieball Info Home"
      >
        <img
          className={styles.homeicon}
          alt="Return to Beastieball Info Home"
          src={home}
        />
      </Link>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.animationtogglecontainer}>
        <AnimationToggle break={true} />
      </div>
      <div className={styles.externallinkcontainer}>
        <ExternalLinks />
      </div>
    </div>
  );
}
