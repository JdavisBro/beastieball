import { useNavigate, useParams } from "react-router-dom";

import styles from "./Encounters.module.css";
import ENCOUNTER_DATA from "../../data/EncounterData";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import EncounterBeastieElem from "./EncounterBeastieElem";
import getLevelBonus from "./getLevelBonus";
import { useState } from "react";
import MoveModalProvider from "../../shared/MoveModalProvider";

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

  const bonus_levels =
    encounter && encounter.scales
      ? getLevelBonus(
          typeof encounter.scales == "string" ? encounter.scales : "redd",
          bossesDefeated,
        )
      : 0;

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
      <div className={styles.box}>
        <label>
          Encounter:{" "}
          <select
            onChange={(event) =>
              navigate(
                `/team/encounters/${event.target.value == "undefined" ? "" : event.target.value}`,
              )
            }
            value={encounterId}
          >
            <option value={"undefined"}>None</option>
            {ENCOUNTER_LIST.map((encounter) => (
              <option key={encounter.id} value={encounter.id}>
                {prettyName(encounter.id)}
              </option>
            ))}
          </select>
        </label>
        <br />
        {encounter
          ? encounter.scales
            ? `Scales with ${BOSSES_MAP[typeof encounter.scales == "string" ? encounter.scales : "redd"]}: +${Math.floor(bonus_levels)} levels`
            : "No scaling"
          : null}
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
    </>
  );
}
