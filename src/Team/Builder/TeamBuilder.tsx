import { Fragment, useRef, useState } from "react";

import styles from "./TeamBuilder.module.css";
import type { BuilderTeam, TeamBeastie } from "../Types";
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
import BeastieSelect from "../../shared/BeastieSelect";

const CONTROL_BEASTIE = createBeastie("01");
const BEASTIE_KEYS = Object.keys(CONTROL_BEASTIE) as Array<keyof TeamBeastie>;

type TeamHook = [
  BuilderTeam,
  React.Dispatch<React.SetStateAction<BuilderTeam>>,
  () => void,
];

const emptyTeamArr = [...new Array(5).keys()];

function ensureFullTeam([team, setTeam, removeTeam]: TeamHook): TeamHook {
  return [
    emptyTeamArr.map((index) => team[index] ?? null),
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
      BEASTIE_KEYS.every(
        (key) => typeof beastie[key] == typeof CONTROL_BEASTIE[key],
      ),
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

function NoBeastie({
  setBeastieId,
}: {
  setBeastieId: (beastieId: string | undefined) => void;
}) {
  return (
    <div className={styles.noBeastie}>
      <BeastieSelect beastieId={undefined} setBeastieId={setBeastieId} />
    </div>
  );
}

export default function TeamBuilder() {
  const [team, setTeam] = ensureFullTeam(
    useLocalStorage<BuilderTeam>("teamBuilderTeam", []),
  );

  const setBeastie = (teamIndex: number, beastie: TeamBeastie | null) => {
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
        title={`Team Builder - ${import.meta.env.VITE_BRANDING}`}
        description="Team Builder for Beastieball!"
        image="gameassets/sprMainmenu/18.png"
        url="team/builder/"
      />
      <Header
        title="Team Builder"
        returnButtonTo="/team/"
        returnButtonTitle={`${import.meta.env.VITE_BRANDING} Team Page`}
      />
      <BeastieRenderProvider>
        <div
          className={teamScroll ? styles.containerScrolls : styles.container}
        >
          <MoveModalProvider>
            <div className={teamScroll ? styles.teamScroll : styles.team}>
              {team.map((beastie, index) => (
                <Fragment key={beastie?.pid ?? index}>
                  <div className={styles.beastieContainer}>
                    {beastie ? (
                      <Beastie teamBeastie={beastie} />
                    ) : (
                      <NoBeastie
                        setBeastieId={(beastieId) => {
                          if (beastieId) {
                            setBeastie(
                              index,
                              createBeastie(`0${index + 1}`, beastieId),
                            );
                            setEditingBeastie(index);
                          }
                        }}
                      />
                    )}
                    <button
                      disabled={editingBeastie == index}
                      onClick={() => setEditingBeastie(index)}
                    >
                      {editingBeastie == index ? "Editing" : "Edit"}
                    </button>
                  </div>
                  {index != 4 ? (
                    <button
                      onClick={() => {
                        const target = team[index + 1];
                        if (target) {
                          setBeastie(index, target);
                        } else {
                          setBeastie(index, null);
                        }
                        if (beastie) {
                          setBeastie(index + 1, beastie);
                        } else {
                          setBeastie(index + 1, null);
                        }
                      }}
                    >
                      ⇄
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
              </label>
              <TeamImageButton team={team.filter((beastie) => !!beastie)} />
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
                          window.alert(
                            "Invalid Team Data. Report on GitHub if you think this is incorrect.",
                          );
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
                  Save Team JSON
                </button>
              </>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                Load Team JSON
              </button>
              <button onClick={() => setTeam(emptyTeamArr.map(() => null))}>
                Reset Team
              </button>
            </Box>
            {team[editingBeastie] ? (
              <EditBeastie
                key={team[editingBeastie].pid + team[editingBeastie].specie}
                beastie={team[editingBeastie]}
                setBeastie={(beastie) =>
                  setBeastie(
                    editingBeastie,
                    typeof beastie == "function"
                      ? team[editingBeastie]
                        ? beastie(team[editingBeastie])
                        : createBeastie("01")
                      : beastie,
                  )
                }
              />
            ) : null}
          </div>
        </div>
      </BeastieRenderProvider>
    </>
  );
}
