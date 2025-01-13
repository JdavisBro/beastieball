import { useContext } from "react";

import styles from "./Beastie.module.css";
import { Move } from "../../data/MoveData";
import { TypeData } from "../../data/TypeColor";
import MoveModalContext from "../../shared/MoveModalContext";

export default function BeastieMove({
  move,
  impossible,
}: {
  move: Move;
  impossible: boolean;
}) {
  const setModalMove = useContext(MoveModalContext);

  return (
    <div
      className={styles.move}
      style={
        {
          "--move-color": TypeData[move.type].color,
          "--move-url": `url("/gameassets/sprType/${move.type}.png")`,
        } as React.CSSProperties
      }
      onClick={() => {
        if (setModalMove) {
          setModalMove(move);
        }
      }}
    >
      <div className={styles.moveblock}></div>
      {impossible ? (
        <div title="This Beastie cannot learn this Play.">⚠️</div>
      ) : null}
      <div className={styles.movename}>{move.name}</div>
    </div>
  );
}
