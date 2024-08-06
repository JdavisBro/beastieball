import styles from "./Playdex.module.css";
import { MOVE_DIC, Move } from "../data/MoveData";
import MoveView from "../shared/MoveView";
import OpenGraph from "../shared/OpenGraph";
import Header from "../shared/Header";
import { useState } from "react";
import MoveModalProvider from "../shared/MoveModalProvider";

declare global {
  interface Window {
    MOVE_DIC: { [key: string]: Move };
  }
}

const SortFunctions: ((move1: Move, move2: Move) => number)[] = [
  // Type
  (move1, move2) =>
    move1.type - move2.type ||
    move2.pow - move1.pow ||
    move1.name.localeCompare(move2.name),
  // Alphabetical
  (move1, move2) => move1.name.localeCompare(move2.name),
  // Pow
  (move1, move2) =>
    move2.pow - move1.pow ||
    move1.type - move2.type ||
    move1.name.localeCompare(move2.name),
  // Effect (unimplemented)
  (move1, move2) => move1.name.localeCompare(move2.name),
  // Target
  (move1, move2) =>
    Number(move1.type > 2) - Number(move2.type > 2) ||
    move2.targ - move1.targ ||
    move2.pow - move1.pow ||
    move1.name.localeCompare(move2.name),
];

export default function PlayDex() {
  window.MOVE_DIC = MOVE_DIC;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(0);
  const [typeFilter, setTypeFilter] = useState(-1);

  let moves = Object.keys(MOVE_DIC).map((id) => MOVE_DIC[id]);
  if (search) {
    moves = moves.filter((move) =>
      move.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (typeFilter != -1) {
    moves = moves.filter((move) => move.type == typeFilter);
  }
  moves = moves.sort(SortFunctions[sort]);

  return (
    <>
      <OpenGraph
        title="PlayDex"
        image="gameassets/sprMainmenu/6.png"
        url="playdex/"
        description="Beastieball Move List"
      />
      <Header title="PlayDex" />
      <div className={styles.settings}>
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          onChange={(event) => setSearch(event.target.value)}
        />{" "}
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          onChange={(event) => setSort(Number(event.target.value))}
          value={String(sort)}
        >
          <option value="0">Type</option>
          <option value="1">Alphabetical</option>
          <option value="2">Pow</option>
          {/* <option value="3">Effect</option> */}
          <option value="4">Target</option>
        </select>{" "}
        <label htmlFor="sort">Type: </label>
        <select
          id="sort"
          onChange={(event) => setTypeFilter(Number(event.target.value))}
          value={String(typeFilter)}
        >
          <option value="-1">All</option>
          <option value="0">Body</option>
          <option value="1">Spirit</option>
          <option value="2">Mind</option>
          <option value="3">Volley</option>
          <option value="4">Support</option>
          <option value="5">Defense</option>
        </select>
      </div>
      <div className={styles.movescontainer}>
        <MoveModalProvider>
          {moves.map((move) => (
            <MoveView move={move} key={move.id} />
          ))}
        </MoveModalProvider>
      </div>
    </>
  );
}
