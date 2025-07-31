import { Fragment, useRef, useState } from "react";

import styles from "./TeamBuilder.module.css";
import type { TeamBeastie } from "../Types";
import OpenGraph from "../../shared/OpenGraph";
import Header from "../../shared/Header";
import Beastie from "../Beastie/Beastie";
import createBeastie from "./createBeastie";
import EditBeastie from "./EditBeastie";
import { useLocalStorage } from "usehooks-ts";
import MoveModalProvider from "../../shared/MoveModalProvider";
import useScreenOrientation from "../../utils/useScreenOrientation";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import SavedTeams from "./SavedTeams";
import TeamImageButton from "../TeamImageButton";
import useLocalization, {
  LocalizationFunction,
} from "../../localization/useLocalization";

const BEASTIE_KEYS = Object.keys(createBeastie("01"));

function createTeam(L: LocalizationFunction) {
  return [
    createBeastie("01", L),
    createBeastie("02", L),
    createBeastie("03", L),
    createBeastie("04", L),
    createBeastie("05", L),
  ];
}

type TeamHook = [
  TeamBeastie[],
  React.Dispatch<React.SetStateAction<TeamBeastie[]>>,
  () => void,
];

const emptyTeamArr = [...new Array(5).keys()];

function ensureFullTeam(
  [team, setTeam, removeTeam]: TeamHook,
  L: LocalizationFunction,
): TeamHook {
  const newTeam = createTeam(L);
  return [
    emptyTeamArr.map((index) => team[index] ?? newTeam[index]),
    setTeam,
    removeTeam,
  ];
}

function verifyTeamJson(json: unknown) {
  if (!Array.isArray(json)) {
    return false;
  }
  if (
    !json.every((beastie) =>
      BEASTIE_KEYS.every((key) => beastie[key] !== undefined),
    )
  ) {
    return false;
  }
  return true;
}

export function Box({ children }: { children: React.ReactNode[] }) {
  return (
    <div className={styles.box}>
      {children
        .filter((c) => c)
        .map((c, index) =>
          index > 0 ? (
            <Fragment key={index}>
              {" - "}
              {c}
            </Fragment>
          ) : (
            c
          ),
        )}
    </div>
  );
}

export default function TeamBuilder() {
  const { L } = useLocalization();

  const [team, setTeam] = ensureFullTeam(
    useLocalStorage<TeamBeastie[]>("teamBuilderTeam", []),
    L,
  );

  const setBeastie = (teamIndex: number, beastie: TeamBeastie) => {
    team[teamIndex] = beastie;
    setTeam((team) => {
      const newTeam = [...team];
      newTeam[teamIndex] = beastie;
      return newTeam;
    });
  };

  const [editingBeastie, setEditingBeastie] = useState(0);

  const [teamScroll, setTeamScroll] = useLocalStorage(
    "teamBuilderScroll",
    useScreenOrientation(),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <OpenGraph
        title={L("common.title", {
          page: L("teams.builder.title"),
          branding: import.meta.env.VITE_BRANDING,
        })}
        description={L("teams.builder.description")}
        image="gameassets/sprMainmenu/18.png"
        url="team/builder/"
      />
      <Header
        title={L("teams.builder.title")}
        returnButtonTo="/team/"
        returnButtonTitle={L("teams.return", {
          branding: import.meta.env.VITE_BRANDING,
        })}
      />
      <BeastieRenderProvider>
        <div
          className={teamScroll ? styles.containerScrolls : styles.container}
        >
          <MoveModalProvider>
            <div className={teamScroll ? styles.teamScroll : styles.team}>
              {team.map((beastie, index) => (
                <Fragment key={beastie.pid}>
                  <div className={styles.beastieContainer}>
                    <Beastie teamBeastie={beastie} />
                    <button
                      disabled={editingBeastie == index}
                      onClick={() => setEditingBeastie(index)}
                    >
                      {editingBeastie == index
                        ? L("teams.builder.editing")
                        : L("teams.builder.edit")}
                    </button>
                  </div>
                  {index != 4 ? (
                    <button
                      onClick={() => {
                        const target = team[index + 1];
                        setBeastie(index, target);
                        setBeastie(index + 1, beastie);
                      }}
                    >
                      {L("teams.builder.swap")}
                    </button>
                  ) : undefined}
                </Fragment>
              ))}
            </div>
          </MoveModalProvider>
          <div className={teamScroll ? styles.editScrolls : styles.edit}>
            <Box>
              <label>
                Team Scrolls Horizontally:
                <input
                  type="checkbox"
                  defaultChecked={teamScroll}
                  onChange={(event) =>
                    setTeamScroll(event.currentTarget.checked)
                  }
                />
                {L("teams.builder.scrollsHorizontally")}
              </label>
              <TeamImageButton team={team} />
            </Box>
            <Box>
              <SavedTeams
                currentTeam={team}
                setCurrentTeam={setTeam}
                setCurrentBeastie={(beastie: TeamBeastie) =>
                  setBeastie(editingBeastie, beastie)
                }
              />
              <>
                <input
                  type="file"
                  onChange={(event) => {
                    const files = event.currentTarget.files;
                    if (files) {
                      files[0].text().then((text) => {
                        const newteam = JSON.parse(text);
                        if (!verifyTeamJson(newteam)) {
                          console.log("Invalid Team Loaded");
                          return;
                        }
                        setTeam(
                          [...new Array(5).keys()].map(
                            (index) =>
                              newteam[index] ?? createBeastie("0" + index),
                          ),
                        );
                      });
                    }
                  }}
                  accept=".json"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    const blob = new Blob([JSON.stringify(team)]);
                    a.download = "team.json";
                    a.href = URL.createObjectURL(blob);
                    a.click();
                  }}
                >
                  {L("teams.builder.saveJson")}
                </button>
              </>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                {L("teams.builder.loadJson")}
              </button>
              <button onClick={() => setTeam(createTeam(L))}>
                {L("teams.builder.reset")}
              </button>
            </Box>
            <EditBeastie
              key={team[editingBeastie].pid + team[editingBeastie].specie}
              beastie={team[editingBeastie]}
              setBeastie={(beastie) =>
                setBeastie(
                  editingBeastie,
                  typeof beastie == "function"
                    ? beastie(team[editingBeastie])
                    : beastie,
                )
              }
            />
          </div>
        </div>
      </BeastieRenderProvider>
    </>
  );
}
