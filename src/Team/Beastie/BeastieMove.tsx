import { useContext } from "react";

import styles from "./Beastie.module.css";
import { Move } from "../../data/MoveData";
import { TypeData } from "../../data/TypeColor";
import MoveModalContext from "../../shared/MoveModalContext";
import { useLocalStorage } from "usehooks-ts";

export default function BeastieMove({
  move,
  impossible,
}: {
  move: Move;
  impossible: boolean;
}) {
  const setModalMove = useContext(MoveModalContext);

  const [simpleMoves] = useLocalStorage("simpleMoves", false);

  const type = move.type >= 10 ? move.type - 10 : move.type;
  const typedata = TypeData[type] ?? TypeData[0];
  return (
    <div
      className={styles.move}
      style={
        {
          "--move-color": typedata.color,
          "--move-dark": typedata.darkColor,
          "--move-url": `url("/gameassets/sprType/${type}.png")`,
        } as React.CSSProperties
      }
      onClick={() => {
        if (setModalMove) {
          setModalMove(move);
        }
      }}
    >
      {simpleMoves ? null : (
        <div className={styles.moveothercolor}>
          <div className={styles.movehalftone}></div>
        </div>
      )}
      <div className={styles.moveblock}></div>
      {impossible ? (
        <div title="This Beastie cannot learn this Play.">⚠️</div>
      ) : null}
      <div className={styles.movename}>{move.name}</div>
    </div>
  );
}
