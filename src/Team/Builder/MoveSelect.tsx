import { useState } from "react";

import Modal from "../../shared/Modal";
import MoveView from "../../shared/MoveView";
import MOVE_DIC from "../../data/MoveData";
import styles from "./TeamBuilder.module.css";
import useLocalization from "../../localization/useLocalization";
import { useLocation, useNavigate } from "react-router-dom";
import { BeastieType } from "../../data/BeastieData";

enum MoveFilterMode {
  None,
  Level,
  Friend,
}

export default function MoveSelect({
  beastiedata,
  teamBeastieMovelist,
  setMove,
}: {
  beastiedata: BeastieType;
  teamBeastieMovelist: string[];
  setMove: (index: number, move: string) => void;
}) {
  const { L } = useLocalization();

  const hash = decodeURIComponent(useLocation().hash);
  const hashMoveNum =
    hash.startsWith("#SelectPlay: ") && Number(hash.slice(13));
  const hashSelecting =
    hashMoveNum && hashMoveNum >= 1 && hashMoveNum <= 3 && hashMoveNum - 1;

  const [selectingState, setSelecting] = useState<undefined | number>(
    undefined,
  );
  const selecting =
    selectingState ?? (hashSelecting === false ? undefined : hashSelecting);

  const navigate = useNavigate();
  const selectMove = (moveId: string) => {
    setMove(selecting ?? 0, moveId);
    setSelecting(undefined);
    navigate(-1);
  };

  const [filterType, setFilterType] = useState(-1);
  const [filterMode, setFilterMode] = useState(MoveFilterMode.None);

  const levelMoves = beastiedata.learnset
    .sort(([level], [level2]) => (level as number) - (level2 as number))
    .map(([, moveId]) => moveId);
  let possibleMoves =
    filterMode == MoveFilterMode.Level
      ? levelMoves.map((moveId) => MOVE_DIC[moveId])
      : beastiedata.attklist
          .map((moveId) => MOVE_DIC[moveId])
          .sort(
            (move1, move2) =>
              move1.type - move2.type ||
              move2.pow - move1.pow ||
              L(move1.name).localeCompare(L(move2.name)),
          )
          .filter(
            filterMode == MoveFilterMode.Friend
              ? (move) => !levelMoves.includes(move.id)
              : () => true,
          );
  if (filterType != -1) {
    possibleMoves = possibleMoves.filter((move) => move.type == filterType);
  }

  return (
    <div className={styles.box}>
      <Modal
        header={L("teams.builder.selectPlay", {
          num: String((selecting ?? 0) + 1),
        })}
        open={selecting !== undefined}
        onClose={() => setSelecting(undefined)}
        hashValue={`SelectPlay: ${(selecting ?? 0) + 1}`}
      >
        <div className={styles.moveSelectModal}>
          <div>
            <label>
              Type:{" "}
              <select
                value={filterType}
                onChange={(event) =>
                  setFilterType(Number(event.currentTarget.value))
                }
              >
                <option value={-1}>Any</option>
                <option value={0}>Body</option>
                <option value={1}>Spirit</option>
                <option value={2}>Mind</option>
                <option value={3}>Volley</option>
                <option value={4}>Support</option>
                <option value={5}>Defense</option>
              </select>
            </label>
            {" - "}
            <label>
              From:{" "}
              <select
                value={filterMode}
                onChange={(event) =>
                  setFilterMode(Number(event.currentTarget.value))
                }
              >
                <option value={MoveFilterMode.None}>Any</option>
                <option value={MoveFilterMode.Level}>Level Up</option>
                <option value={MoveFilterMode.Friend}>Friends</option>
              </select>
            </label>
          </div>
          <div className={styles.moveSelectGrid}>
            {possibleMoves.map((move) => (
              <div
                key={move.id}
                className={styles.moveSelectMove}
                onClick={() => selectMove(move.id)}
              >
                <MoveView move={move} noLearner={true} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {L("teams.builder.plays")}
      <button onClick={() => setSelecting(0)}>
        {L("teams.builder.playNum", { num: "1" })}
        {MOVE_DIC[teamBeastieMovelist[0]]
          ? L(MOVE_DIC[teamBeastieMovelist[0]].name)
          : L("teams.builder.playUnset")}
      </button>
      <button onClick={() => setSelecting(1)}>
        {L("teams.builder.playNum", { num: "2" })}
        {MOVE_DIC[teamBeastieMovelist[1]]
          ? L(MOVE_DIC[teamBeastieMovelist[1]].name)
          : L("teams.builder.playUnset")}
      </button>
      <button onClick={() => setSelecting(2)}>
        {L("teams.builder.playNum", { num: "3" })}
        {MOVE_DIC[teamBeastieMovelist[2]]
          ? L(MOVE_DIC[teamBeastieMovelist[2]].name)
          : L("teams.builder.playUnset")}
      </button>
    </div>
  );
}
