import styles from "./StatDistribution.module.css";
import TypeColor from "../../data/TypeColor";
import type { BeastieType } from "../../data/BeastieData";

type BarProps = {
  value: number;
  color: string | null | undefined;
  right: boolean;
};

function StatBar(props: BarProps): React.ReactElement {
  const value = props.value;
  const containerclass = props.right
    ? `${styles.barcontainer} ${styles.barcontainerright}`
    : styles.barcontainer;
  const barclass = props.right
    ? `${styles.bar} ${styles.barright}`
    : styles.bar;
  const textclass = props.right
    ? `${styles.text} ${styles.textright}`
    : styles.text;
  return (
    <div className={containerclass}>
      <div
        className={barclass}
        style={{
          width: String((value / 120) * 100) + "%", // I think 120 is max stats
          backgroundColor: props.color !== null ? props.color : "none",
        }}
      ></div>
      <div className={textclass}>{value}</div>
    </div>
  );
}

type Props = {
  beastiedata: BeastieType;
};

export default function StatDistribution(props: Props): React.ReactElement {
  const beastiedata = props.beastiedata;
  return (
    <div className={styles.container}>
      <div className={styles.statcontainer}>
        <div className={styles.barcontainer}>POW</div>
        <StatBar value={beastiedata.ba} right={false} color={TypeColor.Body} />
        <StatBar
          value={beastiedata.ha}
          right={false}
          color={TypeColor.Spirit}
        />
        <StatBar value={beastiedata.ma} right={false} color={TypeColor.Mind} />
      </div>
      <div className={styles.midblock}>
        <div className={styles.barcontainer}></div>
        <img src="/gameassets/sprIcon/0.png" alt="Body" />
        <img src="/gameassets/sprIcon/1.png" alt="Spirit" />
        <img src="/gameassets/sprIcon/2.png" alt="Mind" />
      </div>
      {/* prettier-ignore */ /* (doesn't wrap 2 of the statbars) */}
      <div className={styles.statcontainer}>
          <div className={`${styles.barcontainer} ${styles.barcontainerright}`}>DEF</div>
          <StatBar 
            value={beastiedata.bd}
            right={true}
            color={TypeColor.Body}
          />
          <StatBar
            value={beastiedata.hd}
            right={true}
            color={TypeColor.Spirit}
          />
          <StatBar
            value={beastiedata.md}
            right={true}
            color={TypeColor.Mind}
          />
        </div>
    </div>
  );
}
