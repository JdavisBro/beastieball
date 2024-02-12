import ExternalLinks from "../shared/ExternalLinks";
import arrow from "../assets/arrow.svg";
import styles from "./Header.module.css";

type Props = {
  beastiename: string | undefined;
  sidebarvisibility: boolean;
  onSetSidebarVisibility: (visible: boolean) => void;
  noAnimations: boolean;
  onSetNoAnimations: (noAnim: boolean) => void;
};

export default function Header(props: Props): React.ReactNode {
  return (
    <div className={styles.header}>
      <img
        className={
          props.sidebarvisibility
            ? `${styles.toggleicon} ${styles.toggleiconvisible}`
            : styles.toggleicon
        }
        src={arrow}
        alt={
          props.sidebarvisibility
            ? "Enable Sidebar Arrow"
            : "Disable Sidebar Arrow"
        }
        aria-haspopup="menu"
        tabIndex={0}
        onClick={() => props.onSetSidebarVisibility(!props.sidebarvisibility)}
        // prettier-ignore
        onKeyDown={(event) => {if (event.key == "Enter") {props.onSetSidebarVisibility(!props.sidebarvisibility);}}}
      />
      <div className={styles.title}>
        {props.beastiename !== undefined ? `${props.beastiename} - ` : ""}
        Beastiepedia
      </div>
      <div className={styles.animationtoggle}>
        <input
          defaultChecked={props.noAnimations}
          id="noAnim"
          type="checkbox"
          onChange={(e) => props.onSetNoAnimations(e.target.checked)}
        />
        <label htmlFor="noAnim">
          Disable
          <br />
          Animations
        </label>
      </div>
      <div className={styles.externallinkcontainer}>
        <ExternalLinks></ExternalLinks>
      </div>
    </div>
  );
}
