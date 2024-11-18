import { Fragment, useState } from "react";

import styles from "./TeamBuilder.module.css";
import type { TeamBeastie } from "../Types";
import OpenGraph from "../../shared/OpenGraph";
import Header from "../../shared/Header";
import Beastie from "../Beastie/Beastie";
import createBeastie from "./createBeastie";
import EditBeastie from "./EditBeastie";
import { useLocalStorage } from "usehooks-ts";
import MoveModalProvider from "../../shared/MoveModalProvider";

export default function TeamBuilder() {
  const [team, setTeam] = useLocalStorage<TeamBeastie[]>("teamBuilderTeam", [
    createBeastie(),
    createBeastie(),
    createBeastie(),
    createBeastie(),
    createBeastie(),
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

  console.log(team[0]);

  return (
    <>
      <OpenGraph
        title={`Team Builder - ${import.meta.env.VITE_BRANDING}`}
        description="Team Builder for Beastieball!"
        image="gameassets/sprMainmenu/20.png"
        url="teams/builder/"
      />
      <Header title="Team Builder" />
      <div className={styles.container}>
        <MoveModalProvider>
          <div className={styles.team}>
            {team.map((beastie, index) => (
              <Fragment key={beastie.pid}>
                <Beastie teamBeastie={beastie} />
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
              Editing Beastie:{" "}
              <select
                onChange={(event) =>
                  setEditingBeastie(Number(event.currentTarget.value))
                }
              >
                <option value={0}>1 - {team[0].name}</option>
                <option value={1}>2 - {team[1].name}</option>
                <option value={2}>3 - {team[2].name}</option>
                <option value={3}>4 - {team[3].name}</option>
                <option value={4}>5 - {team[4].name}</option>
              </select>
            </label>
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
            <br />
            <label>
              Load JSON{" "}
              <input
                type="file"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (files) {
                    files[0].text().then((text) => setTeam(JSON.parse(text)));
                  }
                }}
              />
            </label>
            <button
              onClick={() => {
                const a = document.createElement("a");
                const blob = new Blob([JSON.stringify(team)]);
                a.download = "team.json";
                a.href = URL.createObjectURL(blob);
                a.click();
              }}
            >
              Save JSON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
