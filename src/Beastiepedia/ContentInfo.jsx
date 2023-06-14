// @flow strict

import TextIcon from "../utils/TextIcon";
import styles from "./Content.module.css";

export default function ContentInfo({ beastiedata }): React$Node {
  var training = "";
  new Map(Array(beastiedata.tyield)).forEach((value, key) => {
    training += `+${value}`;
    switch (key[0]) {
      case "b": // body
        training += "[sprIcon,0]";
        break;
      case "h": // spirit (heart?)
        training += "[sprIcon,1]";
        break;
      case "m": // mind
        training += "[sprIcon,2]";
        break;
    }
    switch (key[1]) {
      case "a":
        training += "POW";
        break;
      case "d":
        training += "DEF";
        break;
    }
  });
  return (
    <div className={styles.info}>
      <div className={styles.inner}>
        <div className={styles.varcontainer}>
          <div className={styles.header}>Number:</div>
          <div className={styles.value}>#{beastiedata.number}</div>
        </div>
        <div className={styles.varcontainer}>
          <div className={styles.header}>Name:</div>
          <div className={styles.value}>{beastiedata.name}</div>
        </div>
        <div className={styles.varcontainer}>
          <div className={styles.header}>Desciption:</div>
          <div className={styles.value}>{beastiedata.desc}</div>
        </div>
        <div className={styles.varcontainer}>
          <div className={styles.header}>Recruit Condition:</div>
          <div className={styles.value}>
            <TextIcon text={beastiedata.recruit.description}></TextIcon>
          </div>
        </div>
        <div className={styles.varcontainer}>
          <div className={styles.header}>Ally Training:</div>
          <div className={styles.value}>
            <TextIcon text={training}></TextIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
