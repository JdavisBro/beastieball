import { useState } from "react";

import Modal from "../../shared/Modal";
import MoveView from "../../shared/MoveView";
import MOVE_DIC from "../../data/MoveData";
import styles from "./TeamBuilder.module.css";

export default function MoveSelect({
  beastieMovelist,
  teamBeastieMovelist,
  setMove,
}: {
  beastieMovelist: string[];
  teamBeastieMovelist: string[];
  setMove: (index: number, move: string) => void;
}) {
  const [selecting, setSelecting] = useState<undefined | number>(undefined);

  const selectMove = (moveId: string) => {
    setMove(selecting ?? 0, moveId);
    setSelecting(undefined);
  };

  return (
    <div>
      <Modal
        header={`Select Play ${(selecting ?? 0) + 1}`}
        open={selecting !== undefined}
        onClose={() => setSelecting(undefined)}
        hashValue="SelectPlay"
      >
        <div className={styles.moveSelectModal}>
          {beastieMovelist.map((moveId) => (
            <div
              key={moveId}
              className={styles.moveSelectMove}
              onClick={() => selectMove(moveId)}
            >
              <MoveView move={MOVE_DIC[moveId]} noLearner={true} />
            </div>
          ))}
        </div>
      </Modal>
      Plays:{" "}
      <button onClick={() => setSelecting(0)}>
        Play 1: {MOVE_DIC[teamBeastieMovelist[0]]?.name ?? "Unset"}
      </button>
      <button onClick={() => setSelecting(1)}>
        Play 2: {MOVE_DIC[teamBeastieMovelist[1]]?.name ?? "Unset"}
      </button>
      <button onClick={() => setSelecting(2)}>
        Play 3: {MOVE_DIC[teamBeastieMovelist[2]]?.name ?? "Unset"}
      </button>
    </div>
  );
}
