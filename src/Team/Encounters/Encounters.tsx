import { useNavigate, useParams } from "react-router-dom";

import styles from "./Encounters.module.css";
import ENCOUNTER_DATA from "../../data/EncounterData";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import EncounterBeastieElem from "./EncounterBeastieElem";

const ENCOUNTER_LIST = Object.values(ENCOUNTER_DATA);

function prettyName(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/(?:^| )[a-z]/g, (m) => m.toUpperCase())
    .replace(/[^ \d]\d/g, (match) => match[0] + " " + match[1]);
}

export default function Encounters() {
  const navigate = useNavigate();
  const encounterId = useParams().encounterId;
  const encounter = encounterId ? ENCOUNTER_DATA[encounterId] : undefined;

  return (
    <>
      <OpenGraph
        title={`Encounters - ${import.meta.env.VITE_BRANDING}`}
        description="View Teams from encounters in Beastieball!"
        image="gameassets/sprMainmenu/27.png"
        url="team/encounters/"
      />
      <Header
        title="Encounters"
        returnButtonTo="/team/"
        returnButtonTitle={`${import.meta.env.VITE_BRANDING} Team Page`}
      />
      <div>
        <select
          onChange={(event) =>
            navigate(`/team/encounters/${event.target.value}`)
          }
          value={encounterId}
        >
          {ENCOUNTER_LIST.map((encounter) => (
            <option key={encounter.id} value={encounter.id}>
              {prettyName(encounter.id)}
            </option>
          ))}
        </select>
        {encounter
          ? encounter.scales
            ? ` - Scales with ${encounter.scales}`
            : " - No scaling"
          : null}
        <div className={styles.team}>
          <BeastieRenderProvider>
            {encounter
              ? encounter.team.map((encBeastie, index) => (
                  <EncounterBeastieElem
                    key={index}
                    encounterId={encounter.id}
                    encBeastie={encBeastie}
                    index={index}
                  />
                ))
              : null}
          </BeastieRenderProvider>
        </div>
      </div>
    </>
  );
}
