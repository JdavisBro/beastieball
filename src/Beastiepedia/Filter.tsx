import { useCallback, useState } from "react";

import Modal from "../shared/Modal";
import abilities, { Ability } from "../data/abilities";
import styles from "./Filter.module.css";
import BEASTIE_DATA from "../data/BeastieData";
import TextTag from "../shared/TextTag";
import MOVE_DIC, { Move } from "../data/MoveData";
import MoveView from "../shared/MoveView";

export enum FilterTypes {
  Ability,
  Move,
  Training,
}

type TrainingTypes = "ba" | "ha" | "ma" | "bd" | "hd" | "md";
const STATS: TrainingTypes[] = ["ba", "bd", "ha", "hd", "ma", "md"];
const TRAINING_TYPES = {
  ba: "Body POW",
  ha: "Spirit POW",
  ma: "Mind POW",
  bd: "Body DEF",
  hd: "Spirit DEF",
  md: "Mind DEF",
};

export type FilterType =
  | [FilterTypes.Ability, Ability]
  | [FilterTypes.Move, Move]
  | [FilterTypes.Training, TrainingTypes];

const beastie_abilities: Ability[] = [];
const beastie_moves: Move[] = [];

BEASTIE_DATA.forEach((beastie) => {
  beastie.ability.forEach((abilityId) => {
    const ability = abilities[abilityId];
    if (!beastie_abilities.includes(ability)) {
      beastie_abilities.push(ability);
    }
  });
  beastie.attklist.forEach((moveId) => {
    const move = MOVE_DIC[moveId];
    if (!beastie_moves.includes(move)) {
      beastie_moves.push(move);
    }
  });
});

beastie_abilities.sort((ability, ability2) =>
  ability.name.localeCompare(ability2.name),
);
beastie_moves.sort(
  (move1, move2) =>
    move1.type - move2.type ||
    move2.pow - move1.pow ||
    move1.name.localeCompare(move2.name),
);

const FILTER_TYPE_PREFIX: Record<FilterTypes, string> = {
  [FilterTypes.Ability]: "Has Trait: ",
  [FilterTypes.Move]: "Learns Play(s): ",
  [FilterTypes.Training]: "Trains Allies: ",
};

const FILTER_TYPES = [
  FilterTypes.Ability,
  FilterTypes.Move,
  FilterTypes.Training,
];

export function createFilterString(filters: FilterType[]) {
  const types: Record<FilterTypes, FilterType[]> = {
    [FilterTypes.Ability]: [],
    [FilterTypes.Move]: [],
    [FilterTypes.Training]: [],
  };
  for (const filter of filters) {
    types[filter[0]].push(filter);
  }

  return FILTER_TYPES.map<[FilterTypes, string]>((type) => [
    type,
    types[type].reduce(
      (accum2, filter) =>
        accum2 +
        (accum2 ? ", " : "") +
        (filter[0] == FilterTypes.Training
          ? TRAINING_TYPES[filter[1]]
          : filter[1].name),
      "",
    ),
  ]).reduce(
    (accum, [type, values]) =>
      accum +
      (values ? (accum ? " + " : "") + FILTER_TYPE_PREFIX[type] + values : ""),
    "",
  );
}

function AbilityButton({
  ability,
  selected,
  handleClick,
}: {
  ability: Ability;
  selected: boolean;
  handleClick: () => void;
}) {
  return (
    <div
      key={ability.id}
      role="button"
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
      className={selected ? styles.abilitySelected : styles.ability}
    >
      <div>{ability.name}</div>
      <div className={styles.abilityDesc}>
        <TextTag>{ability.desc.replace(/\|/g, "\n")}</TextTag>
      </div>
    </div>
  );
}

export default function Filter({
  filters,
  setFilters,
}: {
  filters: FilterType[];
  setFilters: React.Dispatch<React.SetStateAction<FilterType[]>>;
}) {
  const [open, setOpen] = useState(false);

  const handleToggleFilter = useCallback(
    (value: FilterType, exclusive?: boolean) => {
      const index = filters.findIndex((filters) =>
        exclusive ? filters[0] == value[0] : filters[1] == value[1],
      );
      if (index != -1) {
        const removed = filters.splice(index, 1)[0];
        const has_id =
          value[0] != FilterTypes.Training &&
          removed[0] != FilterTypes.Training;
        if (
          exclusive &&
          (has_id ? removed[1].id != value[1].id : removed[1] != value[1])
        ) {
          filters.push(value);
        }
      } else {
        filters.push(value);
      }
      setFilters([...filters]);
    },
    [filters, setFilters],
  );

  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");

  const changeTab = useCallback((value: number) => {
    setTab(value);
    setSearch("");
  }, []);

  const training = filters.find(
    (filter) => filter[0] == FilterTypes.Training,
  )?.[1];

  return (
    <div
      className={styles.filterButton}
      role="button"
      title="Sort by Filters"
      tabIndex={0}
      onClick={() => setOpen(true)}
    >
      <div title="">
        <Modal
          header="Filter Beasties"
          open={open}
          onClose={() => setOpen(false)}
          hashValue="Filter"
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              setFilters([]);
            }}
          >
            Clear Filter
          </button>
          {" " + createFilterString(filters)}
          <div className={styles.tabs}>
            <button
              className={tab == 0 ? styles.selectedtab : undefined}
              onClick={() => changeTab(0)}
            >
              Trait
            </button>
            <button
              className={tab == 1 ? styles.selectedtab : undefined}
              onClick={() => changeTab(1)}
            >
              Plays
            </button>
            <button
              className={tab == 2 ? styles.selectedtab : undefined}
              onClick={() => changeTab(2)}
            >
              Training
            </button>
          </div>
          {tab < 2 ? (
            <label>
              Search:{" "}
              <input
                type="search"
                onChange={(event) => setSearch(event.currentTarget.value)}
                value={search}
              />
            </label>
          ) : null}
          <div onWheel={(event) => event.stopPropagation()}>
            {tab == 0 ? (
              <div className={styles.abilityList}>
                {beastie_abilities
                  .filter(
                    (ability) =>
                      !search ||
                      filters.find(
                        (filter) =>
                          filter[0] == FilterTypes.Ability &&
                          filter[1].id == ability.id,
                      ) ||
                      ability.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((ability) => (
                    <AbilityButton
                      key={ability.id}
                      ability={ability}
                      selected={
                        !!filters.find(
                          (filter) =>
                            filter[0] == FilterTypes.Ability &&
                            filter[1].id == ability.id,
                        )
                      }
                      handleClick={() =>
                        handleToggleFilter([FilterTypes.Ability, ability], true)
                      }
                    />
                  ))}
              </div>
            ) : null}
            {tab == 1 ? (
              <div className={styles.moveList}>
                {beastie_moves
                  .filter(
                    (move) =>
                      !search ||
                      filters.find(
                        (filter) =>
                          filter[0] == FilterTypes.Move &&
                          filter[1].id == move.id,
                      ) ||
                      move.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((move) => (
                    <div
                      key={move.id}
                      onClick={() =>
                        handleToggleFilter([FilterTypes.Move, move])
                      }
                      className={
                        filters.find(
                          (filter) =>
                            filter[0] == FilterTypes.Move &&
                            filter[1].id == move.id,
                        )
                          ? styles.moveSelected
                          : styles.moveContainer
                      }
                    >
                      <MoveView move={move} noLearner={true} />
                    </div>
                  ))}
              </div>
            ) : null}
            {tab == 2 ? (
              <>
                {STATS.map((type) => (
                  <button
                    key={type}
                    className={
                      training == type ? styles.trainingSelected : undefined
                    }
                    onClick={() =>
                      handleToggleFilter([FilterTypes.Training, type], true)
                    }
                  >
                    {TRAINING_TYPES[type]}
                  </button>
                ))}
              </>
            ) : null}
          </div>
        </Modal>
      </div>
    </div>
  );
}
