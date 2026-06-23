import { useContext } from "react";

import styles from "./Shared.module.css";
import { Move } from "../data/MoveData";
import { TypeData } from "../data/TypeColor";
import MoveModalContext from "../shared/MoveModalContext";
import useLocalization from "../localization/useLocalization";
import { useLocalStorage } from "usehooks-ts";

const ID_KEYS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function MoveViewMini({
  move,
  impossible,
  handleClick,
}: {
  move: Move | string;
  impossible?: boolean;
  handleClick?: (move: Move) => void;
}) {
  const { L } = useLocalization();

  const setModalMove = useContext(MoveModalContext) ?? handleClick;

  const [simpleMoves] = useLocalStorage("simpleMoves", false);

  const has_move = typeof move !== "string";
  const move_name =
    (!has_move &&
      move.slice(
        move.split("").findIndex((char) => !ID_KEYS.includes(char)),
      )) ||
    "";

  const type = has_move ? (move.type >= 10 ? move.type - 10 : move.type) : 6;
  const typedata = TypeData[type] ?? TypeData[0];
  return (
    <div
      className={setModalMove ? styles.minimoveclickable : styles.minimove}
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
        <div className={styles.minimoveothercolor}>
          <div className={styles.minimovehalftone}></div>
        </div>
      )}
      <div className={styles.minimoveblock}></div>
      {impossible && has_move ? (
        <div title={L("teams.beastie.impossibleMove")}>⚠️</div>
      ) : null}
      <div
        className={type < 6 ? styles.minimovename : styles.minimovenamelight}
      >
        {has_move
          ? L(move.name)
          : move_name.charAt(0).toUpperCase() + move_name.slice(1)}
      </div>
    </div>
  );
}
