import StatDistribution from "./StatDistribution";
import TextTag from "../utils/TextTag";
import styles from "./Content.module.css";
import type { BeastieType } from "./data/BeastieType";

type Props = {
  beastiedata: BeastieType;
};

export default function ContentInfo(props: Props): React.ReactNode {
  const beastiedata = props.beastiedata;
  let training = "";

  for (let i = 0; i < beastiedata.tyield.length; i += 2) {
    const type = String(beastiedata.tyield[i]);
    const value = Number(beastiedata.tyield[i + 1]);
    training += `${training == "" ? "" : "\n"}+${value}`;

    switch (type[0]) {
      case "b":
        // body
        training += "[sprIcon,0]";
        break;

      case "h":
        // spirit (heart)
        training += "[sprIcon,1]";
        break;

      case "m":
        // mind
        training += "[sprIcon,2]";
        break;
    }

    switch (type[1]) {
      case "a":
        training += "POW";
        break;

      case "d":
        training += "DEF";
        break;
    }
  }

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
            <TextTag text={beastiedata.recruit.description}></TextTag>
          </div>
        </div>
        <div className={styles.varcontainer}>
          <div className={styles.header}>Ally Training:</div>
          <div className={styles.value}>
            <TextTag text={training}></TextTag>
          </div>
        </div>
        <StatDistribution beastiedata={beastiedata}></StatDistribution>
      </div>
    </div>
  );
}
