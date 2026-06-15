import { useContext } from "react";

import styles from "./Beastie.module.css";
import { Move } from "../../data/MoveData";
import { TypeData } from "../../data/TypeColor";
import MoveModalContext from "../../shared/MoveModalContext";
import useLocalization from "../../localization/useLocalization";
import { useLocalStorage } from "usehooks-ts";

export default function BeastieMove({
  move,
  impossible,
}: {
  move: Move | string;
  impossible: boolean;
}) {
  const { L } = useLocalization();

  const setModalMove = useContext(MoveModalContext);

  const [simpleMoves] = useLocalStorage("simpleMoves", false);

  const has_move = typeof move !== "string";

  const type = has_move ? (move.type >= 10 ? move.type - 10 : move.type) : 6;
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
        if (setModalMove && has_move) {
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
      {impossible && has_move ? (
        <div title={L("teams.beastie.impossibleMove")}>⚠️</div>
      ) : null}
      <div className={type < 6 ? styles.movename : styles.movenamelight}>
        {has_move ? L(move.name) : move.charAt(0).toUpperCase() + move.slice(1)}
      </div>
    </div>
  );
}
