import styles from "./StatDistribution.module.css";
import TypeColor from "../../data/TypeColor";
import type { BeastieType } from "../../data/BeastieData";

type BarProps = {
  value: number;
  color: string | null | undefined;
  right: boolean;
  verticalPos?: number;
};

function StatBar(props: BarProps): React.ReactElement {
  return (
    <div
      className={props.right ? styles.barcontainerright : styles.barcontainer}
      style={
        {
          "--bar-offset": `${(props.verticalPos ?? 0) * 5}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={props.right ? styles.barright : styles.bar}
        style={{
          width: `${(props.value / 125) * 100}%`, // I think 125 is max stats
          backgroundColor: props.color ?? "none",
        }}
      ></div>
      <div className={props.right ? styles.textright : styles.text}>
        {props.value}
      </div>
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
          verticalPos={1}
        />
        <StatBar
          value={beastiedata.ma}
          right={false}
          color={TypeColor.Mind}
          verticalPos={2}
        />
      </div>
      <div className={styles.midblock}>
        <div className={styles.barcontainer}></div>
        <img src="/gameassets/sprIcon/0.png" alt="Body" />
        <img src="/gameassets/sprIcon/1.png" alt="Spirit" />
        <img src="/gameassets/sprIcon/2.png" alt="Mind" />
      </div>
      <div className={styles.statcontainer}>
        <div className={`${styles.barcontainer} ${styles.barcontainerright}`}>
          DEF
        </div>
        <StatBar
          value={beastiedata.bd}
          right={true}
          color={TypeColor.Body}
          verticalPos={2}
        />
        <StatBar
          value={beastiedata.hd}
          right={true}
          color={TypeColor.Spirit}
          verticalPos={1}
        />
        <StatBar value={beastiedata.md} right={true} color={TypeColor.Mind} />
      </div>
    </div>
  );
}
