import { useState } from "react";

import MoveView from "../../shared/MoveView";
import styles from "./MoveList.module.css";
import MOVE_DIC, { Move } from "../../data/MoveData";
import { LEARN_SETS } from "../../data/Learnsets";
import MoveModalProvider from "../../shared/MoveModalProvider";

type MoveTextProps = {
  level?: number;
  move: Move | undefined;
  selected: boolean;
  onSelect: () => void;
};

function MoveText(props: MoveTextProps): React.ReactElement {
  if (props.move === undefined) {
    // This can never happen?
    return <div>Move not found?</div>;
  }
  return (
    <div className={styles.movecontainer}>
      {props.level ? (
        <span className={styles.movelevel}>{props.level}</span>
      ) : null}

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
        <img src={`/gameassets/sprIcon/${props.move.type}.png`} alt="" />
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

  const moveselected = MOVE_DIC[selected];
  if (moveselected === undefined) {
    console.log(`Move not found: "${selected}"`);
  }

  const learnmoves: Array<React.ReactElement> = [];
  let friendmoves: Move[] = [];
  if (learnset) {
    for (let move in learnset) {
      const level = learnset[move][1];
      move = learnset[move][0];
      if (!MOVE_DIC[move]) {
        console.log(`Move not found: "${move}"`);
        continue;
      }
      learnmoves.push(
        <MoveText
          level={level}
          move={MOVE_DIC[move]}
          selected={selected == move}
          onSelect={() => setSelected(move)}
          key={move}
        />,
      );
    }
  } else {
    friendmoves = props.movelist.map((move) => MOVE_DIC[move]);
  }

  for (const move of props.movelist.values()) {
    if (!MOVE_DIC[move]) {
      console.log(`Move not found: "${move}"`);
      continue;
    }

    if (learnset && !learnset.some((m) => m[0] == move)) {
      friendmoves.push(MOVE_DIC[move]);
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
          {friendmoves
            .sort(
              (move1, move2) =>
                move1.type - move2.type ||
                move2.pow - move1.pow ||
                move1.name.localeCompare(move2.name),
            )
            .map((move) => (
              <MoveText
                move={move}
                selected={selected == move.id}
                onSelect={() => setSelected(move.id)}
                key={move.id}
              />
            ))}
        </div>
      </div>
      <div className={styles.viewcontainer}>
        {moveselected ? (
          <MoveModalProvider>
            <MoveView move={moveselected} />
          </MoveModalProvider>
        ) : null}
      </div>
      <div className={styles.issuetext}>
        Incorrect or broken? Report on{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href={import.meta.env.VITE_ISSUES_URL}
        >
          GitHub issues
        </a>
        .
      </div>
    </div>
  );
}
