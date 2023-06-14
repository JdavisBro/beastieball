// @flow strict

import styles from "./Beastiepedia.module.css";
import ContentInfo from "./ContentInfo";
import ContentPreview from "./ContentPreview";

export default function Content({ beastiedata }): React$Node {
  if (beastiedata) {
    return (
      <div className={styles.content}>
        <ContentPreview beastiedata={beastiedata}></ContentPreview>
        <ContentInfo beastiedata={beastiedata}></ContentInfo>
      </div>
    );
  } else {
    return (
      <div className={`${styles.content} ${styles.contentnotselected}`}>
        <h1 className={styles.notselectedtext}>
          No Beastie Selected
          <br />
          Select a beastie on the left.
        </h1>
      </div>
    );
  }
}
