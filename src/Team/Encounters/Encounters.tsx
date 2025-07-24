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
import useLocalization, {
  LocalizationFunction,
} from "../../localization/useLocalization";

const ENCOUNTER_LIST = Object.values(ENCOUNTER_DATA);

function prettyName(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/(?:^| )[a-z]/g, (m) => m.toUpperCase())
    .replace(/[^ \d]\d/g, (match) => match[0] + " " + match[1]);
}

// only rowdy bosses, overworld ranked coaches, valerie. can be "defeated"
const BOSSES_MAP: Record<
  string,
  string | ((L: LocalizationFunction) => string)
> = {
  kaz: "¦socialssetup_classsocial_005¦",
  riven: "¦socialssetup_classsocial_003¦",
  science: "¦socialssetup_classsocial_007¦",
  pirate: "¦socialssetup_classsocial_004¦",
  celeb: "¦socialssetup_classsocial_006¦",
  streamer: "¦socialssetup_classsocial_009¦",
  academy: "¦Headmaster_Create0npcname_001¦",
  warrior: "¦socialssetup_classsocial_010¦",
  coral_shroom_0: "¦beastiesetup_name_003¦",
  shroom_path_boss: "¦beastiesetup_name_004¦",
  reserve_boss: "¦beastiesetup_name_002¦",

  redd: "¦Redd_Create0npcname_001¦", // always true

  // non-defeatable
  default: "Default", // can't
  racer: "¦Racer_Create0npcname_001¦", // no defeated_ tag
  cycle: "¦Cycle_Create0npcname_001¦", // no defeated_ tag
  redd2: (L) => L("¦Redd_Create0npcname_001¦") + " 2", // no defeated_ tag
  mask: "¦Mask_Create0npcname_001¦", // no defeated_ tag
  champion: "¦Valerie_Create0npcname_001¦",
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
  const { L, getLink } = useLocalization();

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

  const bossSep = L("teams.encounters.bossSep");

  const scalesBossKey = encounter
    ? BOSSES_MAP[
        typeof encounter.scales == "string" ? encounter.scales : "redd"
      ]
    : undefined;
  const scalesBossName = scalesBossKey
    ? typeof scalesBossKey == "string"
      ? L(scalesBossKey)
      : scalesBossKey(L)
    : "";
  return (
    <>
      <OpenGraph
        title={L("common.title", {
          page: L("teams.encounters.title"),
          branding: import.meta.env.VITE_BRANDING,
        })}
        description={L("teams.encounters.description")}
        image="gameassets/sprMainmenu/27.png"
        url="team/encounters/"
      />
      <Header
        title={L("teams.encounters.title")}
        returnButtonTo="/team/"
        returnButtonTitle={L("teams.return", {
          branding: import.meta.env.VITE_BRANDING,
        })}
      />
      <div className={styles.box}>
        <label>
          Encounter:{" "}
          <select
            onChange={(event) =>
              navigate(
                getLink(
                  `/team/encounters/${event.target.value == "undefined" ? "" : event.target.value}`,
                ),
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
            ? L("teams.encounters.scales", {
                boss: scalesBossName,
                levels: String(Math.floor(bonus_levels)),
              })
            : L("teams.encounters.noScaling")
          : null}
      </div>
      <div className={styles.box}>
        {L("teams.encounters.defeatedBoss")}
        <span className={styles.bosses}>
          {DEFEATABLE_BOSSES.map((bossId, index) => (
            <>
              {index == 0 ? null : bossSep}
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
                {typeof BOSSES_MAP[bossId] == "string"
                  ? L(BOSSES_MAP[bossId])
                  : BOSSES_MAP[bossId](L)}
              </label>
            </>
          ))}
          {bossSep}
          <button onClick={() => setBossesDefeated({ redd: true })}>
            {L("teams.encounters.resetBoss")}
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
