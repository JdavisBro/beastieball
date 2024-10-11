import styles from "./Teams.module.css";
import { BeastieType } from "../data/BeastieData";
import { TeamBeastie } from "./Types";

const TypeColors = ["#ffdb5e", "#fb88b0", "#8ddcf5"];

function round2Ceil(num: number) {
  return Math.ceil(Math.round(num * 100) / 100);
}

function statCalc(
  base_stat: number,
  level: number,
  coaching: number,
  training: number,
) {
  return (
    5 +
    round2Ceil(
      (base_stat / 50) * level * (0.7 + 0.3 * coaching) +
        Math.floor(training / 4) * (level / 50) * (0.7 + 0.3 * coaching),
    )
  );
}

function StatRow({
  type,
  basePow,
  baseDef,
  trainingPow,
  trainingDef,
  coachingPow,
  coachingDef,
  level,
  max_stat,
}: {
  type: number;
  basePow: number;
  baseDef: number;
  trainingPow: number;
  trainingDef: number;
  coachingPow: number;
  coachingDef: number;
  level: number;
  max_stat: number;
}) {
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
        title={`Coached: ${Math.round(coachingPow * 100)}%\nTraining: ${trainingPow}`}
      >
        <div
          className={styles.barColRight}
          style={{ width: `${(pow / max_stat) * 96}%` }}
        ></div>
        <div className={styles.barText}>{pow}</div>
      </div>
      <div>
        <img
          className={styles.barImg}
          src={`/gameassets/sprIcon/${type}.png`}
        />
      </div>
      <div
        className={styles.statBar}
        title={`Coached: ${Math.round(coachingDef * 100)}%\nTraining: ${trainingDef}`}
      >
        <div
          className={styles.barCol}
          style={{ width: `${(def / max_stat) * 96}%` }}
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
}: {
  teamBeastie: TeamBeastie;
  beastiedata: BeastieType;
  level: number;
}) {
  const max_stat = statCalc(
    Math.max(
      beastiedata.ba,
      beastiedata.bd,
      beastiedata.ha,
      beastiedata.hd,
      beastiedata.ma,
      beastiedata.md,
    ),
    level,
    1,
    120,
  );

  return (
    <div className={styles.statDist}>
      <div className={styles.statRow}>
        <div>POW</div>
        <div>DEF</div>
      </div>
      <StatRow
        type={0}
        basePow={beastiedata.ba}
        baseDef={beastiedata.bd}
        trainingPow={teamBeastie.ba_t}
        trainingDef={teamBeastie.bd_t}
        coachingPow={teamBeastie.ba_r}
        coachingDef={teamBeastie.bd_r}
        max_stat={max_stat}
        level={level}
      />
      <StatRow
        type={1}
        basePow={beastiedata.ha}
        baseDef={beastiedata.hd}
        trainingPow={teamBeastie.ha_t}
        trainingDef={teamBeastie.hd_t}
        coachingPow={teamBeastie.ha_r}
        coachingDef={teamBeastie.hd_r}
        max_stat={max_stat}
        level={level}
      />
      <StatRow
        type={2}
        basePow={beastiedata.ma}
        baseDef={beastiedata.md}
        trainingPow={teamBeastie.ma_t}
        trainingDef={teamBeastie.md_t}
        coachingPow={teamBeastie.ma_r}
        coachingDef={teamBeastie.md_r}
        max_stat={max_stat}
        level={level}
      />
    </div>
  );
}
