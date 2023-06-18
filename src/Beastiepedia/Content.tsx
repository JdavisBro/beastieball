import ContentInfo from "./ContentInfo";
import ContentPreview from "./ContentPreview";
import styles from "./Beastiepedia.module.css";
// import MOVE_DATA from "./data/Movedata";
import type { BeastieType } from "./data/BeastieType";

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
          Select a beastie on the left.
        </h1>
      </div>
    );
  }
}
