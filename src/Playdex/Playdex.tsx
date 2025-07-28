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
import MOVE_RECENTLY_UPDATED from "./RecentlyUpdated";
import useLocalization, {
  LocalizationFunction,
} from "../localization/useLocalization";
import SOCIAL_DATA from "../data/SocialData";

declare global {
  interface Window {
    MOVE_DIC: { [key: string]: Move };
  }
}

const SortFunctions: (
  L: LocalizationFunction,
) => ((move1: Move, move2: Move) => number)[] = (L) => [
  // Type
  (move1, move2) =>
    move1.type - move2.type ||
    move2.pow - move1.pow ||
    L(move1.name).localeCompare(L(move2.name)),
  // Alphabetical
  (move1, move2) => L(move1.name).localeCompare(L(move2.name)),
  // Pow
  (move1, move2) =>
    move2.pow - move1.pow ||
    move1.type - move2.type ||
    L(move1.name).localeCompare(L(move2.name)),
  // Effect (unimplemented)
  (move1, move2) => L(move1.name).localeCompare(L(move2.name)),
  // Target
  (move1, move2) =>
    Number(move1.type > 2) - Number(move2.type > 2) ||
    move2.targ - move1.targ ||
    move2.pow - move1.pow ||
    L(move1.name).localeCompare(L(move2.name)),
];

const CHAR_LIST = [
  "riley",
  "kaz",
  "riven",
  "science",
  "celeb",
  // "pirate",
  "streamer",
  // "academy",
  // "warrior",
];

const HIDDEN_MOVES = [
  "userlowered", // Shrapnel, not in game.
  "xtra", // Bonus.
  "???", // Unrevealed.
];

export default function PlayDex() {
  const { L } = useLocalization();

  window.MOVE_DIC = MOVE_DIC;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(0);
  const [typeFilter, setTypeFilter] = useState(-1);
  const [effectFilter, setEffectFilter] = useState(-1);
  const [friendFilter, setFriendFilter] = useState<string | undefined>(
    undefined,
  );
  const [recentlyChanged, setRecentlyChanged] = useState(false);

  let moves = Object.keys(MOVE_DIC)
    .map((id) => MOVE_DIC[id])
    .filter((move) => !HIDDEN_MOVES.includes(move.id));
  if (search) {
    moves = moves.filter((move) =>
      L(move.name).toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (typeFilter != -1) {
    moves = moves.filter((move) => move.type == typeFilter);
  }
  if (effectFilter != -1) {
    const { effects, use, target } = EffectFilters[effectFilter];
    moves = moves.filter((move) => {
      if (effects) {
        return move.eff.some((moveEff) =>
          effects.some((filterEff) =>
            typeof filterEff == "number"
              ? Math.abs(moveEff.eff) == filterEff
              : Math.abs(moveEff.eff) == filterEff[0] &&
                moveEff.pow == filterEff[1],
          ),
        );
      } else if (use) {
        return use.includes(move.use);
      } else if (target) {
        return move.type < 3 && target.includes(move.targ);
      }
    });
  }
  if (recentlyChanged) {
    moves = moves.filter((move) => MOVE_RECENTLY_UPDATED.includes(move.id));
  }
  moves = moves.sort(SortFunctions(L)[sort]);

  const [spoilerFriends] = useFriendSpoiler();
  const [spoilerMode] = useSpoilerMode();

  return (
    <div className={styles.container}>
      <OpenGraph
        title={L("common.title", {
          page: L("playdex.title"),
          branding: import.meta.env.VITE_BRANDING,
        })}
        image="gameassets/sprMainmenu/6.png"
        url="playdex/"
        description={L("playdex.description")}
      />
      <Header title={L("playdex.title")} />
      <div className={styles.settings}>
        <label>
          {L("common.searchPrefix")}
          <input
            type="search"
            onChange={(event) => setSearch(event.currentTarget.value)}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
        {" - "}
        <label>
          {L("playdex.sort.label")}
          <select
            id="sort"
            onChange={(event) => setSort(Number(event.currentTarget.value))}
            value={String(sort)}
          >
            <option value="0">{L("playdex.sort.type")}</option>
            <option value="1">{L("playdex.sort.alphabetical")}</option>
            <option value="2">{L("common.pow")}</option>
            {/* <option value="3">{L("playdex.sort.effect")}</option> */}
            <option value="4">{L("playdex.sort.target")}</option>
          </select>
        </label>
        {" - "}
        <label>
          {L("playdex.type")}
          <select
            onChange={(event) =>
              setTypeFilter(Number(event.currentTarget.value))
            }
            value={String(typeFilter)}
          >
            <option value="-1">{L("playdex.all")}</option>
            <option value="0">{L("common.types.body")}</option>
            <option value="1">{L("common.types.spirit")}</option>
            <option value="2">{L("common.types.mind")}</option>
            <option value="3">{L("common.types.volley")}</option>
            <option value="4">{L("common.types.support")}</option>
            <option value="5">{L("common.types.defense")}</option>
          </select>
        </label>
        {" - "}
        <label>
          {L("playdex.effect.label")}
          <select
            onChange={(event) =>
              setEffectFilter(Number(event.currentTarget.value))
            }
            value={String(effectFilter)}
          >
            <option value={-1}>{L("playdex.all")}</option>
            {EffectFilters.map((effect, index) => (
              <option
                key={effect.name + (effect.placeholderKey ?? "")}
                value={index}
              >
                {effect.name.startsWith("common")
                  ? L(effect.name)
                  : L(
                      "playdex.effect." + effect.name,
                      effect.placeholderKey
                        ? { "0": L(effect.placeholderKey) }
                        : undefined,
                    )}
              </option>
            ))}
          </select>
        </label>
        {" - "}
        <label>
          {L("playdex.favor")}
          <select
            onChange={(event) =>
              setFriendFilter(
                event.currentTarget.value == "undefined"
                  ? undefined
                  : event.currentTarget.value,
              )
            }
            value={friendFilter}
          >
            <option value="undefined">{L("playdex.favorNone")}</option>
            {CHAR_LIST.map((friendId) => {
              const friend = SOCIAL_DATA.find(
                (friend) => friendId == friend.id,
              );
              if (!friend) {
                return;
              }
              const friendName = L(friend.name);

              return (
                <option key={friendId} value={friendId}>
                  {spoilerMode == SpoilerMode.OnlySeen &&
                  !spoilerFriends[friendId]
                    ? friendName.slice(0, 2) + "..."
                    : friendName}
                </option>
              );
            })}
          </select>
        </label>
        {" - "}
        <label>
          {L("playdex.recentlyChanged")}
          <input
            type="checkbox"
            checked={recentlyChanged}
            onChange={(event) =>
              setRecentlyChanged(event.currentTarget.checked)
            }
          />
        </label>
      </div>
      <div className={styles.movescontainer}>
        <MoveModalProvider>
          {moves.map((move) => (
            <MoveView move={move} key={move.id} friendFilter={friendFilter} />
          ))}
        </MoveModalProvider>
      </div>
    </div>
  );
}
