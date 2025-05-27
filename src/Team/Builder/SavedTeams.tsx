import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import styles from "./TeamBuilder.module.css";
import Modal from "../../shared/Modal";
import { TeamBeastie } from "../Types";
import BEASTIE_DATA from "../../data/BeastieData";
import { createPid } from "./createBeastie";
import useLocalization from "../../localization/useLocalization";

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
  const { L } = useLocalization();

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
      <button onClick={() => setOpen(true)}>
        {L("teams.builder.savedTeams.title")}
      </button>
      <Modal
        header={L("teams.builder.savedTeams.title")}
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
                          src={`/icons/${L(BEASTIE_DATA.get(beastie.specie)?.name ?? "beastiesetup_name_001", undefined, true)}.png`}
                        />
                        <button
                          title={L("teams.builder.savedTeams.copyDesc")}
                          onClick={() => {
                            const newBeastie = structuredClone(beastie);
                            newBeastie.pid = createPid();
                            setCurrentBeastie(newBeastie);
                          }}
                        >
                          {L("teams.builder.savedTeams.copy")}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    title={L("teams.builder.savedTeams.saveDesc")}
                    onClick={() => setSavedTeam(index, [...currentTeam])}
                  >
                    {L("teams.builder.savedTeams.save")}
                  </button>
                  <button
                    title={L("teams.builder.savedTeams.loadDesc")}
                    onClick={() => setCurrentTeam([...team.team])}
                  >
                    {L("teams.builder.savedTeams.load")}
                  </button>
                  <button
                    title={L("teams.builder.savedTeams.deleteDesc")}
                    onClick={() => {
                      savedTeams.splice(index, 1);
                      setSavedTeams([...savedTeams]);
                    }}
                  >
                    {L("teams.builder.savedTeams.delete")}
                  </button>
                </div>
              ))
            : L("teams.builder.savedTeams.noTeams")}
        </div>
        <button onClick={() => setSavedTeam(savedTeams.length, currentTeam)}>
          {L("teams.builder.savedTeams.saveCurrent")}
        </button>
      </Modal>
    </>
  );
}
