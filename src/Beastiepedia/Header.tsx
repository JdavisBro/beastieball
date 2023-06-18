import ExternalLinks from "../utils/ExternalLinks";
import arrow from "../assets/arrow.svg";
import styles from "./Header.module.css";

type Props = {
  beastiename: string | undefined;
  sidebarvisibility: boolean;
  useSetSidebarVisibility: (visible: boolean) => void;
};

export default function ContentInfo(props: Props): React.ReactNode {
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
        onClick={() => props.useSetSidebarVisibility(!props.sidebarvisibility)}
        // prettier-ignore
        onKeyDown={(event) => {if (event.key == "Enter") {props.useSetSidebarVisibility(!props.sidebarvisibility);}}}
      />
      <div className={styles.title}>
        {props.beastiename !== undefined ? `${props.beastiename} - ` : ""}
        Beastiepedia
      </div>
      <div className={styles.externallinkcontainer}>
        <ExternalLinks></ExternalLinks>
      </div>
    </div>
  );
}
