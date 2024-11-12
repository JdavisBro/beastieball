import styles from "./Playdex.module.css";
import { MOVE_DIC, Move } from "../data/MoveData";
import MoveView from "../shared/MoveView";
import OpenGraph from "../shared/OpenGraph";
import Header from "../shared/Header";
import { useState } from "react";
import MoveModalProvider from "../shared/MoveModalProvider";
import EffectFilters from "./EffectFilters";
import {
  SpoilerMode,
  useFriendSpoiler,
  useSpoilerMode,
} from "../shared/useSpoiler";

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

const CHAR_LIST: Record<string, string> = {
  riley: "Riley",
  kaz: "Kaz",
  riven: "Riven",
  science: "Celia",
  celeb: "Sunsoo",
};

export default function PlayDex() {
  window.MOVE_DIC = MOVE_DIC;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(0);
  const [typeFilter, setTypeFilter] = useState(-1);
  const [effectFilter, setEffectFilter] = useState(-1);
  const [friendFilter, setFriendFilter] = useState<string | undefined>(
    undefined,
  );

  let moves = Object.keys(MOVE_DIC).map((id) => MOVE_DIC[id]);
  if (search) {
    moves = moves.filter((move) =>
      move.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (typeFilter != -1) {
    moves = moves.filter((move) => move.type == typeFilter);
  }
  if (effectFilter != -1) {
    const effects = EffectFilters[effectFilter].effects;
    moves = moves.filter((move) =>
      move.eff.some((moveEff) =>
        effects.some((filterEff) =>
          typeof filterEff == "number"
            ? Math.abs(moveEff.eff) == filterEff
            : Math.abs(moveEff.eff) == filterEff[0] &&
              moveEff.pow == filterEff[1],
        ),
      ),
    );
  }
  moves = moves.sort(SortFunctions[sort]);

  const [spoilerFriends] = useFriendSpoiler();
  const [spoilerMode] = useSpoilerMode();

  return (
    <>
      <OpenGraph
        title="PlayDex"
        image="gameassets/sprMainmenu/6.png"
        url="playdex/"
        description="List of moves/plays from Beastieball."
      />
      <Header title="PlayDex" />
      <div className={styles.settings}>
        <label>
          Search:{" "}
          <input
            type="text"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>{" "}
        <label>
          Sort by:{" "}
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
          </select>
        </label>{" "}
        <label>
          Type:{" "}
          <select
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
        </label>{" "}
        <label>
          Effect:{" "}
          <select
            onChange={(event) => setEffectFilter(Number(event.target.value))}
            value={String(effectFilter)}
          >
            <option value={-1}>All</option>
            {EffectFilters.map((effect, index) => (
              <option key={effect.name} value={index}>
                {effect.name}
              </option>
            ))}
          </select>
        </label>{" "}
        <label>
          Favor:{" "}
          <select
            onChange={(event) =>
              setFriendFilter(
                event.target.value == "undefined"
                  ? undefined
                  : event.target.value,
              )
            }
            value={friendFilter}
          >
            <option value="undefined">None</option>
            {Object.keys(CHAR_LIST).map((friendId) => (
              <option key={friendId} value={CHAR_LIST[friendId]}>
                {spoilerMode == SpoilerMode.OnlySeen &&
                !spoilerFriends[friendId]
                  ? "???"
                  : CHAR_LIST[friendId]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.movescontainer}>
        <MoveModalProvider>
          {moves.map((move) => (
            <MoveView move={move} key={move.id} friendFilter={friendFilter} />
          ))}
        </MoveModalProvider>
      </div>
    </>
  );
}
