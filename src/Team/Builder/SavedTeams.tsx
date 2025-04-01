import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import styles from "./TeamBuilder.module.css";
import Modal from "../../shared/Modal";
import { TeamBeastie } from "../Types";
import BEASTIE_DATA from "../../data/BeastieData";
import { createPid } from "./createBeastie";

type SavedTeam = { name: string; team: TeamBeastie[] };

export default function SavedTeams({
  currentTeam,
  setCurrentTeam,
  setCurrentBeastie,
}: {
  currentTeam: TeamBeastie[];
  setCurrentTeam: React.Dispatch<React.SetStateAction<TeamBeastie[]>>;
  setCurrentBeastie: (beastie: TeamBeastie) => void;
}) {
  const [open, setOpen] = useState(false);
  const [savedTeams, setSavedTeams] = useLocalStorage<SavedTeam[]>(
    "teamBuilderSavedTeams",
    [],
  );

  const setSavedTeam = (index: number, team?: TeamBeastie[], name?: string) => {
    const newteam = team ?? savedTeams[index]?.team;
    if (!newteam) {
      throw Error("NO TEAM");
    }
    savedTeams[index] = {
      name: name ?? savedTeams[index]?.name ?? `Team #${index + 1}`,
      team: newteam,
    };
    setSavedTeams([...savedTeams]);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Saved Teams</button>
      <Modal
        header="Saved Teams"
        hashValue="SavedTeams"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className={styles.savedTeams}>
          {savedTeams.length
            ? savedTeams.map((team, index) => (
                <div key={index}>
                  <input
                    type="text"
                    className={styles.savedTeamName}
                    value={team.name}
                    onChange={(event) =>
                      setSavedTeam(index, undefined, event.currentTarget.value)
                    }
                    onKeyDownCapture={(event) => event.stopPropagation()}
                  />
                  <div className={styles.savedTeamBeasties}>
                    {team.team.map((beastie) => (
                      <div key={beastie.pid}>
                        <img
                          src={`/icons/${BEASTIE_DATA.get(beastie.specie)?.name}.png`}
                        />
                        <button
                          title="Overwrites the Human you're currently editing."
                          onClick={() => {
                            const newBeastie = structuredClone(beastie);
                            newBeastie.pid = createPid();
                            setCurrentBeastie(newBeastie);
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    title="Saves your Current Team over this one."
                    onClick={() => setSavedTeam(index, [...currentTeam])}
                  >
                    Overwrite
                  </button>
                  <button
                    title="Loads this Team as your Current Team."
                    onClick={() => setCurrentTeam([...team.team])}
                  >
                    Load
                  </button>
                  <button
                    title="Deletes this Team from your Saved Teams."
                    onClick={() => {
                      savedTeams.splice(index, 1);
                      setSavedTeams([...savedTeams]);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            : "No Saved Teams"}
        </div>
        <button onClick={() => setSavedTeam(savedTeams.length, currentTeam)}>
          Save Current Team as New Team
        </button>
      </Modal>
    </>
  );
}
