import { useState } from "react";

import MoveView from "../../shared/MoveView";
import styles from "./MoveList.module.css";
import MOVE_DATA from "../../data/Movedata";
import { LEARN_SETS } from "../../data/Learnsets";
import { MoveType } from "../../data/MoveType";

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
        role="button"
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

  const [selected, setSelected] = useState(
    learnset ? learnset[0][0] : props.movelist[0],
  );
  if (!props.movelist.includes(selected)) {
    setSelected(
      learnset &&
        learnset.length > 0 &&
        learnset[0].length > 0 &&
        props.movelist.includes(learnset[0][0])
        ? learnset[0][0]
        : props.movelist[0],
    );
  }

  const moveselected = MOVE_DATA.get(selected);
  if (moveselected === undefined) {
    console.log(`Move not found: "${selected}"`);
  }

  const learnmoves: Array<React.ReactElement> = [];
  const friendmoves: Array<React.ReactElement> = [];
  if (learnset) {
    for (let move in learnset) {
      const level = learnset[move][1];
      move = learnset[move][0];
      if (!MOVE_DATA.has(move)) {
        console.log(`Move not found: "${move}"`);
        continue;
      }
      learnmoves.push(
        <MoveText
          level={level}
          move={MOVE_DATA.get(move)}
          selected={selected == move}
          onSelect={() => setSelected(move)}
          key={move}
        />,
      );
    }
  } else {
    props.movelist.forEach((move) =>
      friendmoves.push(
        <MoveText
          move={MOVE_DATA.get(move)}
          selected={selected == move}
          onSelect={() => setSelected(move)}
          key={move}
        />,
      ),
    );
  }

  for (const move of props.movelist.values()) {
    if (!MOVE_DATA.has(move)) {
      console.log(`Move not found: "${move}"`);
      continue;
    }

    if (learnset && !learnset.some((m) => m[0] == move)) {
      friendmoves.push(
        <MoveText
          move={MOVE_DATA.get(move)}
          selected={selected == move}
          onSelect={() => setSelected(move)}
          key={move}
        />,
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.listcontainer}>
        <div className={styles.movelist}>
          <div>From Levels:</div>
          {learnmoves}
        </div>
        <div className={styles.movelist}>
          <div>From Friends:</div>
          {friendmoves}
        </div>
      </div>
      <div className={styles.viewcontainer}>
        {moveselected ? <MoveView move={moveselected} /> : null}
      </div>
    </div>
  );
}
