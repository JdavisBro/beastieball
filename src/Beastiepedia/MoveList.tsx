import { useState } from "react";

import MoveView from "../shared/MoveView";
import styles from "./MoveList.module.css";
import MOVE_DATA from "../data/Movedata";
import { LEARN_SETS } from "../data/Learnsets";
import { MoveType } from "../data/MoveType";

type MoveTextProps = {
  level?: number;
  move: MoveType | undefined;
  selected: boolean;
  onSelect: () => void;
};

function MoveText(props: MoveTextProps): React.ReactElement {
  if (props.move === undefined) {
    // This can never happen?
    return <div>Move not found?</div>;
  }
  let pretext = "";
  if (props.level !== undefined) {
    pretext = String(props.level) + " - ";
  }
  return (
    <div className={styles.movecontainer}>
      {pretext}
      <span
        tabIndex={0}
        className={
          props.selected
            ? `${styles.movetext} ${styles.selected}`
            : styles.movetext
        }
        onClick={props.onSelect}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            props.onSelect();
          }
        }}
      >
        {props.move.name}
      </span>
    </div>
  );
}

type Props = {
  movelist: Array<string>;
  learnset: number;
};

export default function MoveList(props: Props): React.ReactElement {
  const learnset = LEARN_SETS[props.learnset];

  const [selected, setSelected] = useState(learnset[0][0]);
  if (!props.movelist.includes(selected)) {
    setSelected(learnset[0][0]);
  }

  const moveselected = MOVE_DATA.get(selected);
  if (moveselected === undefined) {
    throw Error(`Move not found: "${selected}"`);
  }

  const learnmoves: Array<React.ReactElement> = [];
  const friendmoves: Array<React.ReactElement> = [];
  for (let move in learnset) {
    const level = learnset[move][1];
    move = learnset[move][0];
    if (!MOVE_DATA.has(move)) {
      throw Error(`Move not found: "${move}"`);
    }
    learnmoves.push(
      <MoveText
        level={level}
        move={MOVE_DATA.get(move)}
        selected={selected == move}
        onSelect={() => setSelected(move)}
        key={move}
      ></MoveText>
    );
  }

  for (const move of props.movelist.values()) {
    if (!MOVE_DATA.has(move)) {
      throw Error(`Move not found: "${move}"`);
    }

    if (!learnset.some((m) => m[0] == move)) {
      friendmoves.push(
        <MoveText
          move={MOVE_DATA.get(move)}
          selected={selected == move}
          onSelect={() => setSelected(move)}
          key={move}
        ></MoveText>
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.listcontainer}>
        <div className={styles.movelist}>
          <div>Moves from Levels:</div>
          {learnmoves}
        </div>
        <div className={styles.movelist}>
          <div>Moves from Friends:</div>
          {friendmoves}
        </div>
      </div>
      <MoveView move={moveselected}></MoveView>
    </div>
  );
}
