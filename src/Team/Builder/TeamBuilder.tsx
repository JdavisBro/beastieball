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

const BEASTIE_KEYS = Object.keys(createBeastie("01"));

function createTeam() {
  return [
    createBeastie("01"),
    createBeastie("02"),
    createBeastie("03"),
    createBeastie("04"),
    createBeastie("05"),
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

export default function TeamBuilder() {
  const [team, setTeam] = useLocalStorage<TeamBeastie[]>(
    "teamBuilderTeam",
    createTeam(),
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
        title={`Team Builder - ${import.meta.env.VITE_BRANDING}`}
        description="Team Builder for Humanball!"
        image="gameassets/sprMainmenu/18.png"
        url="team/builder/"
      />
      <Header
        title="Team Builder"
        returnButtonTo="/team/"
        returnButtonTitle={`${import.meta.env.VITE_BRANDING} Team Page`}
      />
      <BeastieRenderProvider>
        <div className={styles.container}>
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
                      {editingBeastie == index ? "Editing" : "Edit"}
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
                      ⇄
                    </button>
                  ) : undefined}
                </Fragment>
              ))}
            </div>
          </MoveModalProvider>
          <div className={styles.edit}>
            <div className={styles.editOptions}>
              <label>
                <input
                  type="checkbox"
                  defaultChecked={teamScroll}
                  onChange={(event) =>
                    setTeamScroll(event.currentTarget.checked)
                  }
                />
                Team Scrolls Horizontally
              </label>
              <div>
                <TeamImageButton team={team} />
              </div>
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
              <div>
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
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  Load Team JSON
                </button>
                <button onClick={() => setTeam(createTeam())}>
                  Reset Team
                </button>
              </div>
              <SavedTeams
                currentTeam={team}
                setCurrentTeam={setTeam}
                setCurrentBeastie={(beastie: TeamBeastie) =>
                  setBeastie(editingBeastie, beastie)
                }
              />
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
        </div>
      </BeastieRenderProvider>
    </>
  );
}
