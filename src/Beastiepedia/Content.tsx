import ContentInfo from "./Info/ContentInfo";
import ContentPreview from "./Preview/ContentPreview";
import styles from "./Beastiepedia.module.css";
import type { BeastieType } from "../data/BeastieType";

type Props = {
  beastiedata: BeastieType | null | undefined;
  sidebarvisible: boolean;
};

export default function Content(props: Props): React.ReactNode {
  const beastiedata = props.beastiedata;

  if (beastiedata) {
    return (
      <div
        className={
          props.sidebarvisible
            ? styles.content
            : `${styles.content} ${styles.contentwide}`
        }
      >
        <ContentPreview beastiedata={beastiedata}></ContentPreview>
        <ContentInfo beastiedata={beastiedata}></ContentInfo>
      </div>
    );
  } else {
    return (
      <div
        className={
          props.sidebarvisible
            ? `${styles.content} ${styles.contentnotselected}`
            : `${styles.content} ${styles.contentnotselected} ${styles.contentwide}`
        }
      >
        <h1 className={styles.notselectedtext}>
          No Beastie Selected
          <br />
          {props.sidebarvisible
            ? "Select a beastie in the sidebar"
            : "Select a beastie by toggling the menu in the top left"}
          .
        </h1>
      </div>
    );
  }
}
