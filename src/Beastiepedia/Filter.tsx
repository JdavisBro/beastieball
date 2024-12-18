import React, { useCallback, useState } from "react";

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
}

export type FilterType =
  | [FilterTypes.Ability, Ability]
  | [FilterTypes.Move, Move];

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
};

export function createFilterString(filters: FilterType[]) {
  const types: Record<FilterTypes, FilterType[]> = {
    [FilterTypes.Ability]: [],
    [FilterTypes.Move]: [],
  };
  for (const filter of filters) {
    types[filter[0]].push(filter);
  }

  const FILTER_TYPES = [FilterTypes.Ability, FilterTypes.Move];

  return FILTER_TYPES.map<[FilterTypes, string]>((type) => [
    type,
    types[type].reduce(
      (accum2, filter) => accum2 + (accum2 ? ", " : "") + filter[1].name,
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
        const removed = filters.splice(index, 1);
        if (exclusive && removed[0][1].id != value[1].id) {
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
              onClick={() => setTab(0)}
            >
              Trait
            </button>
            <button
              className={tab == 1 ? styles.selectedtab : undefined}
              onClick={() => setTab(1)}
            >
              Plays
            </button>
          </div>
          <label>
            Search:{" "}
            <input
              type="search"
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
          </label>
          <div onWheel={(event) => event.stopPropagation()}>
            {tab == 0 ? (
              <div className={styles.abilityList}>
                {beastie_abilities
                  .filter(
                    (ability) =>
                      !search ||
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
          </div>
        </Modal>
      </div>
    </div>
  );
}
