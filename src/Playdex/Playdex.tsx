import styles from "./Playdex.module.css";
import { MOVE_DIC, Move } from "../data/MoveData";
import MoveView from "../shared/MoveView";

declare global {
  interface Window {
    MOVE_DIC: { [key: string]: Move };
  }
}

const SortFunctions: ((move1: Move, move2: Move) => number)[] = [
  (move1, move2) =>
    move1.type - move2.type ||
    move2.pow - move1.pow ||
    move1.name.localeCompare(move2.name),
  (move1, move2) => move1.name.localeCompare(move2.name),
];

export default function PlayDex() {
  window.MOVE_DIC = MOVE_DIC;

  const moves = Object.keys(MOVE_DIC).map((id) => MOVE_DIC[id]);
  const sorted_moves = moves.sort(SortFunctions[1]);

  return (
    <div className={styles.container}>
      {sorted_moves.map((move) => (
        <MoveView move={move} key={move.id} />
      ))}
    </div>
  );
}
