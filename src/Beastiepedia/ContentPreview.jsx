// @flow strict

import styles from "./Content.module.css";

export default function ContentPreview({ beastiedata }): React$Node {
  return (
    <div className={styles.preview}>
      <div className={styles.inner}>{beastiedata.name}</div>
    </div>
  );
}
