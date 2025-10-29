import { useNavigate, useParams } from "react-router-dom";

import styles from "./Encounters.module.css";
import ENCOUNTER_DATA, {
  Encounter,
  EncounterDataType,
} from "../../data/EncounterData";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import EncounterBeastieElem, {
  encounterToTeamBeastie,
} from "./EncounterBeastieElem";
import getLevelBonus from "./getLevelBonus";
import { useState } from "react";
import MoveModalProvider from "../../shared/MoveModalProvider";
import AiInfo from "./AiInfo";
import { createPid } from "../Builder/createBeastie";

declare global {
  interface Window {
    encounter?: Encounter;
    ENCOUNTER_DATA: EncounterDataType;
  }
}

const ENCOUNTER_LIST = Object.values(ENCOUNTER_DATA);

function prettyName(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/(?:^| )[a-z]/g, (m) => m.toUpperCase())
    .replace(/[^ \d]\d/g, (match) => match[0] + " " + match[1]);
}

// only rowdy bosses, overworld ranked coaches, valerie. can be "defeated"
const BOSSES_MAP: Record<string, string> = {
  kaz: "Kaz",
  riven: "Riven",
  science: "Celia",
  pirate: "Marcy",
  celeb: "Sunsoo",
  streamer: "Elena",
  academy: "Callisto",
  warrior: "Dominic",
  coral_shroom_0: "Surgus",
  shroom_path_boss: "Illugus",
  reserve_boss: "Bongus",

  redd: "Marlin", // always true

  // non-defeatable
  default: "Default", // can't
  racer: "Barnes", // no defeated_ tag
  cycle: "Gene", // no defeated_ tag
  redd2: "Marlin 2", // no defeated_ tag
  mask: "Jack", // no defeated_ tag
  champion: "Valerie",
};

const DEFEATABLE_BOSSES = [
  "kaz",
  "riven",
  "science",
  "pirate",
  "celeb",
  "streamer",
  "academy",
  "warrior",
  "coral_shroom_0",
  "shroom_path_boss",
  "reserve_boss",
  "champion",
];

export default function Encounters() {
  const navigate = useNavigate();
  const encounterId = useParams().encounterId;
  const encounter = encounterId ? ENCOUNTER_DATA[encounterId] : undefined;
  const [bossesDefeated, setBossesDefeated] = useState<Record<string, boolean>>(
    { redd: true },
  );

  window.encounter = encounter;
  window.ENCOUNTER_DATA = ENCOUNTER_DATA;

  const bonus_levels =
    encounter && encounter.scales
      ? getLevelBonus(
          typeof encounter.scales == "string" ? encounter.scales : "redd",
          bossesDefeated,
        )
      : 0;

  const openTeamInBuilder = (forceLevel?: number) => {
    if (!encounter) {
      return;
    }
    const team = encounter.team
      .slice(0, 5)
      .map((encBeastie, index) =>
        encounterToTeamBeastie(
          createPid(),
          encBeastie,
          forceLevel ?? encBeastie.level + bonus_levels,
          encounter.id,
          index,
        ),
      );
    localStorage.setItem("teamBuilderTeam", JSON.stringify(team));
    navigate("/team/builder/");
  };
  const openInBuilderDisabled = !(encounter && encounter.team.length);

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
        secretPage={true}
      />
      <div className={styles.box}>
        <label>
          Encounter:{" "}
          <select
            onChange={(event) =>
              navigate(
                `/team/encounters/${event.target.value == "undefined" ? "" : event.target.value}`,
              )
            }
            value={String(encounterId)}
          >
            <option value={"undefined"}>None</option>
            {ENCOUNTER_LIST.map((encounter) => (
              <option key={encounter.id} value={encounter.id}>
                {prettyName(encounter.id)}
              </option>
            ))}
          </select>
        </label>
        {encounter ? (
          <>
            <br />
            {encounter.scales
              ? `Scales with ${BOSSES_MAP[typeof encounter.scales == "string" ? encounter.scales : "redd"]}: +${Math.floor(bonus_levels)} levels`
              : "No scaling"}{" "}
            <AiInfo encounter={encounter} />
          </>
        ) : null}
      </div>
      <div className={styles.box}>
        Defeated:{" "}
        <span className={styles.bosses}>
          {DEFEATABLE_BOSSES.map((bossId, index) => (
            <>
              {index == 0 ? null : " - "}
              <label key={bossId}>
                <input
                  type="checkbox"
                  checked={bossesDefeated[bossId] == true}
                  onChange={(event) =>
                    setBossesDefeated((bosses) => ({
                      ...bosses,
                      [bossId]: event.target.checked,
                    }))
                  }
                />
                {BOSSES_MAP[bossId]}
              </label>
            </>
          ))}
          {" - "}
          <button onClick={() => setBossesDefeated({ redd: true })}>
            Reset
          </button>
        </span>
      </div>
      <div className={styles.team}>
        <MoveModalProvider>
          <BeastieRenderProvider>
            {encounter
              ? encounter.team.map((encBeastie, index) => (
                  <EncounterBeastieElem
                    key={index}
                    encounterId={encounter.id}
                    encBeastie={encBeastie}
                    index={index}
                    bonus_levels={bonus_levels}
                  />
                ))
              : null}
          </BeastieRenderProvider>
        </MoveModalProvider>
      </div>
      <div className={styles.box}>
        Open in Team Builder:{" "}
        <button
          disabled={openInBuilderDisabled}
          onClick={() => openTeamInBuilder()}
        >
          At Current Levels
        </button>
        {" - "}
        <button
          disabled={openInBuilderDisabled}
          onClick={() => openTeamInBuilder(50)}
        >
          At Level 50
        </button>
      </div>
    </>
  );
}
