import { EncounterDataType } from "../data/EncounterData";
import BEASTIE_DATA from "../data/BeastieData";
import styles from "./Map.module.css";
import { useIsSpoiler } from "../shared/useSpoiler";
import { Link } from "react-router-dom";
import getMetamorphAtLevel from "../Team/Encounters/getMetamorphAtLevel";

export default function EncounterPopup({
  encounterId,
  encounterData,
  loadEncounterData,
}: {
  encounterId: string;
  encounterData: EncounterDataType | undefined;
  loadEncounterData: () => void;
}) {
  const [isSpoilerFn, setSeen] = useIsSpoiler();

  if (!encounterData) {
    loadEncounterData();
    return <div>Loading Encounters</div>;
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
            getMetamorphAtLevel(
              babyBeastieData,
              beastie.level,
              oldBeastieData.id,
            ) ?? oldBeastieData;
          const isWild = beastie.specie == "";
          const isSpoiler = isWild || isSpoilerFn(beastie.specie);

          return (
            <div key={index} className={styles.encounterBeastie}>
              <Link
                to={
                  isWild || isSpoiler ? "" : `/beastiepedia/${beastieData.name}`
                }
                onClick={isSpoiler ? () => setSeen(beastieData.id) : undefined}
              >
                <img
                  src={
                    isSpoiler
                      ? "/gameassets/sprExclam_1.png"
                      : `/icons/${beastieData.name}.png`
                  }
                />
              </Link>
              <div>
                {beastie.name || (isSpoiler ? "???" : beastieData.name)}
              </div>
              {isWild ? <div>Nearby Wild Beastie</div> : null}
              <div>Lvl {beastie.level}</div>
            </div>
          );
        })}
      </div>
      {encounter.scales ? (
        <div>Beastie level or metamorphosis may be higher due to scaling.</div>
      ) : null}
      <Link to={`/team/encounters/${encounter.id}`}>View more details.</Link>
    </div>
  );
}
