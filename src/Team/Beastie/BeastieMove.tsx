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
  move: Move;
  impossible: boolean;
}) {
  const { L } = useLocalization();

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
        <div title={L("teams.beastie.impossibleMove")}>⚠️</div>
      ) : null}
      <div className={styles.movename}>{L(move.name)}</div>
    </div>
  );
}
