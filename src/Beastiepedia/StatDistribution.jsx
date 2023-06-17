// @flow strict

import styles from "./StatDistribution.module.css";

import TypeColor from "./data/TypeColor.js";
import type { BeastieType } from "./data/BeastieType.js";

type BarProps = {
  value: number,
  color: ?string,
  right: boolean,
};

function StatBar(props: BarProps): React$Node {
  var value = props.value;
  var containerclass = props.right
    ? `${styles.barcontainer} ${styles.barcontainerright}`
    : styles.barcontainer;
  var barclass = props.right ? `${styles.bar} ${styles.barright}` : styles.bar;
  return (
    <div className={containerclass}>
      <div
        className={barclass}
        style={{
          width: String((value / 120) * 100) + "%",
          backgroundColor: props.color !== null ? props.color : "none",
        }}
      >
        {value}
      </div>
    </div>
  );
}

type Props = {
  beastiedata: BeastieType,
};

export default function StatDistribution(props: Props): React$Node {
  var beastiedata = props.beastiedata;
  return (
    <div className={styles.container}>
      <div className={styles.statcontainer}>
        <div className={styles.barcontainer}>POW</div>
        <StatBar
          value={beastiedata.ba}
          right={false}
          color={TypeColor.Body}
        ></StatBar>
        <StatBar
          value={beastiedata.ha}
          right={false}
          color={TypeColor.Spirit}
        ></StatBar>
        <StatBar
          value={beastiedata.ma}
          right={false}
          color={TypeColor.Mind}
        ></StatBar>
      </div>
      <div className={styles.midblock}>
        <div className={styles.barcontainer}></div>
        <div className={styles.barcontainer}>
          <img src="/gameassets/sprIcon/0.png" />
        </div>
        <div className={styles.barcontainer}>
          <img src="/gameassets/sprIcon/1.png" />
        </div>
        <div className={styles.barcontainer}>
          <img src="/gameassets/sprIcon/2.png" />
        </div>
      </div>
      <div className={styles.statcontainer}>
        <div className={`${styles.barcontainer} ${styles.barcontainerright}`}>
          DEF
        </div>
        <StatBar
          value={beastiedata.bd}
          right={true}
          color={TypeColor.Body}
        ></StatBar>
        <StatBar
          value={beastiedata.hd}
          right={true}
          color={TypeColor.Spirit}
        ></StatBar>
        <StatBar
          value={beastiedata.md}
          right={true}
          color={TypeColor.Mind}
        ></StatBar>
      </div>
    </div>
  );
}
