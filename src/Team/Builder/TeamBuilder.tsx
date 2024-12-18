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

export default function TeamBuilder() {
  const [team, setTeam] = useLocalStorage<TeamBeastie[]>("teamBuilderTeam", [
    createBeastie("01"),
    createBeastie("02"),
    createBeastie("03"),
    createBeastie("04"),
    createBeastie("05"),
  ]);

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
        description="Team Builder for Beastieball!"
        image="gameassets/sprMainmenu/18.png"
        url="team/builder/"
      />
      <Header
        title="Team Builder"
        returnButtonTo="/team/"
        returnButtonTitle={`${import.meta.env.VITE_BRANDING} Team Page`}
      />
      <div className={styles.container}>
        <BeastieRenderProvider>
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
        </BeastieRenderProvider>
        <div className={styles.edit}>
          <div className={styles.editOptions}>
            <label>
              <input
                type="checkbox"
                defaultChecked={teamScroll}
                onChange={(event) => setTeamScroll(event.currentTarget.checked)}
              />
              Team Scrolls Horizontally
            </label>
            <input
              type="file"
              onChange={(event) => {
                const files = event.currentTarget.files;
                if (files) {
                  files[0].text().then((text) => setTeam(JSON.parse(text)));
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
    </>
  );
}
