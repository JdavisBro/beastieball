import { useContext } from "react";

import styles from "./Teams.module.css";
import { Move } from "../data/MoveData";
import { TypeData } from "../data/TypeColor";
import MoveModalContext from "../shared/MoveModalContext";

export default function BeastieMove({ move }: { move: Move }) {
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
      <div>{move.name}</div>
    </div>
  );
}
