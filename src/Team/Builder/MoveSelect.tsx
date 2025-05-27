import { useState } from "react";

import Modal from "../../shared/Modal";
import MoveView from "../../shared/MoveView";
import MOVE_DIC from "../../data/MoveData";
import styles from "./TeamBuilder.module.css";
import useLocalization from "../../localization/useLocalization";

export default function MoveSelect({
  beastieMovelist,
  teamBeastieMovelist,
  setMove,
}: {
  beastieMovelist: string[];
  teamBeastieMovelist: string[];
  setMove: (index: number, move: string) => void;
}) {
  const { L } = useLocalization();

  const [selecting, setSelecting] = useState<undefined | number>(undefined);

  const selectMove = (moveId: string) => {
    setMove(selecting ?? 0, moveId);
    setSelecting(undefined);
  };

  const possibleMoves = beastieMovelist
    .map((moveId) => MOVE_DIC[moveId])
    .sort(
      (move1, move2) =>
        move1.type - move2.type ||
        move2.pow - move1.pow ||
        L(move1.name).localeCompare(L(move2.name)),
    );

  return (
    <div>
      <Modal
        header={L("teams.builder.selectPlay", {
          num: String((selecting ?? 0) + 1),
        })}
        open={selecting !== undefined}
        onClose={() => setSelecting(undefined)}
        hashValue="SelectPlay"
      >
        <div className={styles.moveSelectModal}>
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
