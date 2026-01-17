import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import styles from "./TeamBuilder.module.css";
import Modal from "../../shared/Modal";
import { BuilderTeam, TeamBeastie } from "../Types";
import BEASTIE_DATA from "../../data/BeastieData";
import { createPid } from "./createBeastie";
import useLocalization from "../../localization/useLocalization";

type SavedTeam = { name: string; team: BuilderTeam };

export default function SavedTeams({
  currentTeam,
  setCurrentTeam,
  setCurrentBeastie,
}: {
  currentTeam: BuilderTeam;
  setCurrentTeam: React.Dispatch<React.SetStateAction<BuilderTeam>>;
  setCurrentBeastie: (beastie: TeamBeastie) => void;
}) {
  const { L } = useLocalization();

  const [open, setOpen] = useState(false);
  const [savedTeams, setSavedTeams] = useLocalStorage<SavedTeam[]>(
    "teamBuilderSavedTeams",
    [],
  );

  const setSavedTeam = (index: number, team?: BuilderTeam, name?: string) => {
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

  const disableSaving = currentTeam.filter((beastie) => !!beastie).length == 0;

  return (
    <>
      <button onClick={() => setOpen(true)}>
        {L("teams.builder.savedTeams.title")}
      </button>
      <Modal
        header={L("teams.builder.savedTeams.title")}
        hashValue="SavedTeams"
        open={open}
        makeOpen={() => setOpen(true)}
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
                    {team.team.map((beastie) =>
                      beastie ? (
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
                      ) : null,
                    )}
                  </div>
                  <button
                    title={L("teams.builder.savedTeams.saveDesc")}
                    disabled={disableSaving}
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
        <button
          disabled={disableSaving}
          onClick={() => setSavedTeam(savedTeams.length, currentTeam)}
        >
          {L("teams.builder.savedTeams.saveCurrent")}
        </button>
      </Modal>
    </>
  );
}
