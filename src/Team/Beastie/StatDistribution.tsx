import styles from "./Beastie.module.css";
import { BeastieType } from "../../data/BeastieData";
import { TeamBeastie } from "../Types";
import useLocalization from "../../localization/useLocalization";

const TypeColors = ["#ffdb5e", "#fb88b0", "#8ddcf5"];

function round5Ceil(num: number) {
  return Math.ceil(Math.round(num * 100000) / 100000);
}

function statCalc(
  base_stat: number,
  level: number,
  coaching: number,
  training: number,
) {
  return (
    5 +
    round5Ceil(
      (base_stat + Math.floor(training / 4)) *
        (level / 50) *
        (0.7 + 0.3 * coaching),
    )
  );
}

const TYPE_ALT = ["body", "spirit", "mind"];

function StatRow({
  type,
  basePow,
  baseDef,
  trainingPow,
  trainingDef,
  coachingPow,
  coachingDef,
  level,
  maxPow,
  maxDef,
}: {
  type: number;
  basePow: number;
  baseDef: number;
  trainingPow: number;
  trainingDef: number;
  coachingPow: number;
  coachingDef: number;
  level: number;
  maxPow: number;
  maxDef: number;
}) {
  const { L } = useLocalization();

  const pow = statCalc(basePow, level, coachingPow, trainingPow);
  const def = statCalc(baseDef, level, coachingDef, trainingDef);

  return (
    <div
      className={styles.statRow}
      style={{ "--type-col": TypeColors[type] } as React.CSSProperties}
    >
      <div>+{Math.floor(trainingPow / 4)}</div>
      <div
        className={styles.statBar}
        title={L("teams.beastie.statTooltip", {
          coached: String(Math.round(coachingPow * 100)),
          training: String(trainingPow),
        })}
      >
        <div
          className={styles.barColRight}
          style={{ width: `${(pow / maxPow) * 100}%` }}
        ></div>
        <div className={styles.barText}>{pow}</div>
      </div>
      <div>
        <img
          className={styles.barImg}
          src={`/gameassets/sprIcon/${type}.png`}
          alt={L("common.types." + TYPE_ALT[type])}
        />
      </div>
      <div
        className={styles.statBar}
        title={L("teams.beastie.statTooltip", {
          coached: String(Math.round(coachingDef * 100)),
          training: String(trainingDef),
        })}
      >
        <div
          className={styles.barCol}
          style={{ width: `${(def / maxDef) * 100}%` }}
        ></div>
        <div className={styles.barText}>{def}</div>
      </div>
      <div>+{Math.floor(trainingDef / 4)}</div>
    </div>
  );
}

export default function StatDistribution({
  teamBeastie,
  beastiedata,
  level,
  maxCoaching,
}: {
  teamBeastie: TeamBeastie;
  beastiedata: BeastieType;
  level: number;
  maxCoaching?: boolean;
}) {
  const { L } = useLocalization();

  const maxPow = statCalc(
    Math.max(beastiedata.ba, beastiedata.ha, beastiedata.ma),
    level,
    1,
    120,
  );
  const maxDef = statCalc(
    Math.max(beastiedata.bd, beastiedata.hd, beastiedata.md),
    level,
    1,
    120,
  );

  return (
    <div className={styles.statDist}>
      <div className={styles.statRow}>
        <div>{L("common.pow")}</div>
        <div>{L("common.def")}</div>
      </div>
      <StatRow
        type={0}
        basePow={beastiedata.ba}
        baseDef={beastiedata.bd}
        trainingPow={teamBeastie.ba_t}
        trainingDef={teamBeastie.bd_t}
        coachingPow={maxCoaching ? 1 : teamBeastie.ba_r}
        coachingDef={maxCoaching ? 1 : teamBeastie.bd_r}
        maxPow={maxPow}
        maxDef={maxDef}
        level={level}
      />
      <StatRow
        type={1}
        basePow={beastiedata.ha}
        baseDef={beastiedata.hd}
        trainingPow={teamBeastie.ha_t}
        trainingDef={teamBeastie.hd_t}
        coachingPow={maxCoaching ? 1 : teamBeastie.ha_r}
        coachingDef={maxCoaching ? 1 : teamBeastie.hd_r}
        maxPow={maxPow}
        maxDef={maxDef}
        level={level}
      />
      <StatRow
        type={2}
        basePow={beastiedata.ma}
        baseDef={beastiedata.md}
        trainingPow={teamBeastie.ma_t}
        trainingDef={teamBeastie.md_t}
        coachingPow={maxCoaching ? 1 : teamBeastie.ma_r}
        coachingDef={maxCoaching ? 1 : teamBeastie.md_r}
        maxPow={maxPow}
        maxDef={maxDef}
        level={level}
      />
    </div>
  );
}
