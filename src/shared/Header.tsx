import ExternalLinks from "./ExternalLinks";
import arrow from "../assets/arrow.svg";
import styles from "./Header.module.css";
import AnimationToggle from "./AnimationToggle";

type Props = {
  title: string | undefined;
  menuButton?: boolean;
  menuButtonState?: boolean;
  onMenuButtonChange?: (enabled: boolean) => void;
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
          alt={
            props.menuButtonState ? "Enable Menu Arrow" : "Disable Menu Arrow"
          }
          aria-haspopup="menu"
          tabIndex={0}
          onClick={() => {
            props.onMenuButtonChange
              ? props.onMenuButtonChange(!props.menuButtonState)
              : null;
          }}
          // prettier-ignore
          onKeyDown={(event) => {if (event.key == "Enter") {props.onMenuButtonChange ? props.onMenuButtonChange(!props.menuButtonState) : null;}}}
        />
      ) : null}
      <div className={props.menuButton ? styles.title : styles.titlenomenu}>
        {props.title}
      </div>
      <div className={styles.animationtogglecontainer}>
        <AnimationToggle break={true} />
      </div>
      <div className={styles.externallinkcontainer}>
        <ExternalLinks />
      </div>
    </div>
  );
}
