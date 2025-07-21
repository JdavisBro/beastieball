import { EncounterDataType } from "../data/EncounterData";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import styles from "./Map.module.css";
// import { Link } from "react-router-dom";

const LEVEL_METAMORPHS = [0, 4, 9, 10, 11];

function findMetamorphAtLevel(
  beastie: BeastieType,
  level: number,
  splitPrefer: string,
) {
  if (!beastie.evolution) {
    return null;
  }
  const levelMetamorphs = beastie.evolution.filter((evo) =>
    evo.condition.some((cond) => LEVEL_METAMORPHS.includes(cond)),
  );
  if (!levelMetamorphs.length) {
    return null;
  }
  const possibleLevelMetamorphs = levelMetamorphs.filter(
    (evo) => typeof evo.value[0] == "number" && evo.value[0] <= level,
  );
  if (!possibleLevelMetamorphs.length) {
    return beastie;
  }
  const evo =
    possibleLevelMetamorphs.find((evo) => evo.specie == splitPrefer) ??
    possibleLevelMetamorphs[0];
  const new_beastie = BEASTIE_DATA.get(evo.specie);
  return new_beastie ?? null;
}

export default function EncounterPopup({
  encounterId,
  encounterData,
  loadEncounterData,
}: {
  encounterId: string;
  encounterData: EncounterDataType | undefined;
  loadEncounterData: () => void;
}) {
  if (!encounterData) {
    return <button onClick={loadEncounterData}>Load Encounters</button>;
  }
  const encounter = encounterData[encounterId];
  if (!encounter) {
    return <div>Encounter not found: {encounterId}</div>;
  }

  return (
    <div className={styles.encounter}>
      <div className={styles.encounterTeam}>
        {encounter.team.map((beastie, index) => {
          const oldBeastieData = BEASTIE_DATA.get(beastie.specie || "shroom1");
          if (!oldBeastieData) {
            return null;
          }
          const babyBeastieData = BEASTIE_DATA.get(oldBeastieData.family);
          if (!babyBeastieData) {
            return null;
          }
          const beastieData =
            findMetamorphAtLevel(
              babyBeastieData,
              beastie.level,
              oldBeastieData.id,
            ) ?? oldBeastieData;

          return (
            <div key={index} className={styles.encounterBeastie}>
              <img src={`/icons/${beastieData.name}.png`} />
              <div>{beastie.name || beastieData.name}</div>
              <div>Lvl {beastie.level}</div>
            </div>
          );
        })}
      </div>
      {encounter.scales ? (
        <div>Beastie level or metamorphosis may be higher due to scaling.</div>
      ) : null}
      {/* <Link to={`/team/encounters/${encounter.id}`}>View more details.</Link> */}
    </div>
  );
}
