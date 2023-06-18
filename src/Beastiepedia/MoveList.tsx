import styles from "./MoveList.module.css";
import MOVE_DATA from "../data/Movedata";
import { LEARN_SETS } from "../data/Learnsets";
import { MoveType } from "../data/MoveType";

type MoveTextProps = {
  level?: number;
  move: MoveType | undefined;
};

function MoveText(props: MoveTextProps): React.ReactElement {
  if (props.move === undefined) {
    return <div>Move not found?</div>;
  }
  let text = "";
  if (props.level !== undefined) {
    text = `${String(props.level)} - ${props.move.name}`;
  } else {
    text = props.move.name;
  }
  return (
    <div tabIndex={0} className={styles.movetext} role="tooltip">
      {text}
    </div>
  );
}

type Props = {
  movelist: Array<string>;
  learnset: number;
};

export default function MoveList(props: Props): React.ReactElement {
  const learnset = LEARN_SETS[props.learnset];
  const learnmoves: Array<React.ReactElement> = [];
  const friendmoves: Array<React.ReactElement> = [];
  for (const move in learnset) {
    if (!MOVE_DATA.has(move)) {
      throw Error(`Move not found: "${move}"`);
    }
    const level = learnset[move];
    learnmoves.push(
      <MoveText level={level} move={MOVE_DATA.get(move)} key={move}></MoveText>
    );
  }
  for (let move in props.movelist) {
    move = props.movelist[move];
    if (!MOVE_DATA.has(move)) {
      throw Error(`Move not found: "${move}"`);
    }
    if (!(move in learnset)) {
      friendmoves.push(
        <MoveText move={MOVE_DATA.get(move)} key={move}></MoveText>
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.movelist}>
        <div>Moves from Levels:</div>
        {learnmoves}
      </div>
      <div className={styles.movelist}>
        <div>Moves from Friends:</div>
        {friendmoves}
      </div>
    </div>
  );
}
