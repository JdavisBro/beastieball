import { Fragment, useRef, useState } from "react";

import styles from "./TeamBuilder.module.css";
import type { BuilderTeam, TeamBeastie } from "../Types";
import OpenGraph from "../../shared/OpenGraph";
import Header from "../../shared/Header";
import Beastie from "../Beastie/Beastie";
import createBeastie from "./createBeastie";
import EditBeastie, { BeastieDoesntExist } from "./EditBeastie";
import { useLocalStorage } from "usehooks-ts";
import MoveModalProvider from "../../shared/MoveModalProvider";
import useScreenOrientation from "../../utils/useScreenOrientation";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import SavedTeams from "./SavedTeams";
import TeamImageButton from "../TeamImageButton";
import useLocalization from "../../localization/useLocalization";
import BeastieSelect from "../../shared/BeastieSelect";
import BEASTIE_DATA from "../../data/BeastieData";
import TeamShareCode from "./TeamShareCode";

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
  try {
    return json.every(
      (beastie) =>
        beastie == null ||
        BEASTIE_KEYS.every(
          (key) => typeof beastie[key] == typeof CONTROL_BEASTIE[key],
        ),
    );
  } catch {
    return false;
  }
}

export function Box({ children }: { children: React.ReactNode }) {
  const sep = useLocalization().L("teams.builder.sep");

  return (
    <div className={styles.box}>
      {Array.isArray(children)
        ? children
            .filter((c) => c)
            .map((c, index) =>
              index > 0 ? (
                <Fragment key={index}>
                  {sep}
                  {c}
                </Fragment>
              ) : (
                c
              ),
            )
        : children}
    </div>
  );
}

function NoBeastie({
  setBeastieId,
  index,
}: {
  setBeastieId: (beastieId: string | undefined) => void;
  index: number;
}) {
  const { L } = useLocalization();

  return (
    <div className={styles.noBeastie}>
      {L("teams.builder.noBeastie")}
      <BeastieSelect
        beastieId={undefined}
        setBeastieId={setBeastieId}
        hashName={`New: ${index + 1}`}
      />
    </div>
  );
}

export default function TeamBuilder() {
  const { L } = useLocalization();

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
                <Fragment key={beastie?.pid ?? index}>
                  <div className={styles.beastieContainer}>
                    {beastie && BEASTIE_DATA.has(beastie.specie) ? (
                      <Beastie teamBeastie={beastie} />
                    ) : (
                      <NoBeastie
                        setBeastieId={(beastieId) => {
                          if (beastieId) {
                            setBeastie(
                              index,
                              createBeastie(`0${index + 1}`, beastieId, L),
                            );
                            setEditingBeastie(index);
                          }
                        }}
                        index={index}
                      />
                    )}
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
                {L("teams.builder.scrollsHorizontally")}
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
                          window.alert(L("teams.builder.loadError"));
                          return;
                        }
                        setTeam(
                          [...new Array(5).keys()].map(
                            (index) => newteam[index] ?? null,
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
              <TeamShareCode
                team={team.filter((beastie) => !!beastie)}
                setTeam={setTeam}
              />
              <button onClick={() => setTeam(emptyTeamArr.map(() => null))}>
                {L("teams.builder.reset")}
              </button>
            </Box>
            {team[editingBeastie] ? (
              <EditBeastie
                key={team[editingBeastie].pid + editingBeastie}
                beastie={team[editingBeastie]}
                setBeastie={(beastie) =>
                  setBeastie(
                    editingBeastie,
                    typeof beastie == "function"
                      ? team[editingBeastie]
                        ? beastie(team[editingBeastie])
                        : createBeastie("01", undefined, L)
                      : beastie,
                  )
                }
              />
            ) : (
              <BeastieDoesntExist
                changeBeastieId={(beastieId) =>
                  setBeastie(
                    editingBeastie,
                    createBeastie(`0${editingBeastie}`, beastieId, L),
                  )
                }
              />
            )}
          </div>
        </div>
      </BeastieRenderProvider>
    </>
  );
}
