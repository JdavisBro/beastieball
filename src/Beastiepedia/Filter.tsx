import { useCallback, useState } from "react";

import Modal from "../shared/Modal";
import abilities, { Ability } from "../data/abilities";
import styles from "./Filter.module.css";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import TextTag from "../shared/TextTag";
import MOVE_DIC, { Move } from "../data/MoveData";
import MoveView from "../shared/MoveView";
import {
  BEASTIE_STUFF_RECENTLY_UPDATED,
  BEASITE_SPRITES_RECENTLY_UPDATED,
} from "./RecentlyUpdated";
import useLocalization, {
  LocalizationFunction,
} from "../localization/useLocalization";
import InfoTabberHeader from "../shared/InfoTabber";

export enum FilterTypes {
  Ability,
  Move,
  Training,
  Metamorphs,
  RecentlyUpdated,
}

type TrainingTypes = "ba" | "ha" | "ma" | "bd" | "hd" | "md";
const STATS: TrainingTypes[] = ["ba", "bd", "ha", "hd", "ma", "md"];
const TRAINING_TYPES = {
  ba: "bodyPow",
  ha: "spiritPow",
  ma: "mindPow",
  bd: "bodyDef",
  hd: "spiritDef",
  md: "mindDef",
};

enum RecentlyUpdatedTypes {
  Stuff,
  Sprites,
}

export type FilterType =
  | [FilterTypes.Ability, Ability]
  | [FilterTypes.Move, Move]
  | [FilterTypes.Training, TrainingTypes]
  | [FilterTypes.Metamorphs, boolean]
  | [FilterTypes.RecentlyUpdated, RecentlyUpdatedTypes];

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

const FILTER_TYPE_PREFIX: Record<FilterTypes, string> = {
  [FilterTypes.Ability]: "trait",
  [FilterTypes.Move]: "play",
  [FilterTypes.Training]: "allyTraining",
  [FilterTypes.Metamorphs]: "metamorphosis",
  [FilterTypes.RecentlyUpdated]: "recentlyUpdated",
};

const FILTER_TYPES = [
  FilterTypes.Ability,
  FilterTypes.Move,
  FilterTypes.Training,
  FilterTypes.Metamorphs,
  FilterTypes.RecentlyUpdated,
];

const Lpre = "beastiepedia.sidebar.filter.";

export function createFilterString(
  filters: FilterType[],
  L: LocalizationFunction,
) {
  const types: Record<FilterTypes, FilterType[]> = {
    [FilterTypes.Ability]: [],
    [FilterTypes.Move]: [],
    [FilterTypes.Training]: [],
    [FilterTypes.Metamorphs]: [],
    [FilterTypes.RecentlyUpdated]: [],
  };
  for (const filter of filters) {
    types[filter[0]].push(filter);
  }

  const diffTypeSep = L(Lpre + "string.diffTypeSep");
  const innerTypeSep = L(Lpre + "string.innerTypeSep");

  return FILTER_TYPES.map<[FilterTypes, string]>((type) => [
    type,
    types[type].reduce(
      (accum2, filter) =>
        accum2 +
        (accum2 ? innerTypeSep : "") +
        (filter[0] == FilterTypes.Training
          ? L("common.types." + TRAINING_TYPES[filter[1]])
          : filter[0] == FilterTypes.Metamorphs
            ? filter[1]
              ? L(Lpre + "string.yes")
              : L(Lpre + "string.no")
            : filter[0] == FilterTypes.RecentlyUpdated
              ? filter[1] == RecentlyUpdatedTypes.Stuff
                ? L(Lpre + "recentlyUpdated.playsTraitsStats")
                : L(Lpre + "recentlyUpdated.spritesColors")
              : L(filter[1].name)),
      "",
    ),
  ]).reduce(
    (accum, [type, values]) =>
      accum +
      (values
        ? (accum ? diffTypeSep : "") +
          L(
            Lpre +
              "string." +
              FILTER_TYPE_PREFIX[type] +
              (types[type].length > 1 ? "s" : ""),
          ) +
          values
        : ""),
    "",
  );
}

export function createFilterFunction(filters: FilterType[]) {
  if (!filters) {
    return undefined;
  }
  return (beastie: BeastieType) =>
    filters.every(([type, value]) => {
      switch (type) {
        case FilterTypes.Ability:
          return beastie.ability.includes(value.id);
        case FilterTypes.Move:
          return beastie.attklist.includes(value.id);
        case FilterTypes.Training:
          return beastie.tyield.some((training) => training == value);
        case FilterTypes.Metamorphs: {
          const metamorphs =
            beastie.evolution?.length &&
            beastie.evolution.some((evo) => evo.condition[0] != 7); // Not Extinct
          return value ? metamorphs : !metamorphs;
        }
        case FilterTypes.RecentlyUpdated:
          switch (value) {
            case RecentlyUpdatedTypes.Stuff:
              return BEASTIE_STUFF_RECENTLY_UPDATED.includes(beastie.id);
            case RecentlyUpdatedTypes.Sprites:
              return BEASITE_SPRITES_RECENTLY_UPDATED.includes(beastie.id);
          }
      }
    });
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
  const { L } = useLocalization();

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
      <div className={styles.abilityInner}>
        <div>{L(ability.name)}</div>
        <div className={styles.abilityDesc}>
          <TextTag>{L(ability.desc).replace(/\|/g, "\n")}</TextTag>
        </div>
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
  const { L } = useLocalization();

  beastie_abilities.sort((ability, ability2) =>
    L(ability.name).localeCompare(L(ability2.name)),
  );
  beastie_moves.sort(
    (move1, move2) =>
      move1.type - move2.type ||
      move2.pow - move1.pow ||
      L(move1.name).localeCompare(L(move2.name)),
  );

  const [open, setOpen] = useState(false);

  const handleToggleFilter = useCallback(
    (value: FilterType, exclusive?: boolean) => {
      const index = filters.findIndex((filters) =>
        exclusive ? filters[0] == value[0] : filters[1] == value[1],
      );
      if (index != -1) {
        const removed = filters.splice(index, 1)[0];
        if (exclusive && removed[1] != value[1]) {
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
  const metamorph = filters.find(
    (filter) => filter[0] == FilterTypes.Metamorphs,
  )?.[1];

  return (
    <div
      className={styles.filterButton}
      role="button"
      title={L("beastiepedia.sidebar.filter.title")}
      tabIndex={0}
      onClick={() => setOpen(true)}
    >
      <div title="">
        <Modal
          header={L("beastiepedia.sidebar.filter.title")}
          open={open}
          makeOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          hashValue="Filter"
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              setFilters([]);
            }}
          >
            {L("beastiepedia.sidebar.filter.clear")}
          </button>
          {" " + createFilterString(filters, L)}
          <InfoTabberHeader
            tab={tab}
            setTab={changeTab}
            tabs={[
              L("beastiepedia.sidebar.filter.trait"),
              L("beastiepedia.sidebar.filter.plays"),
              L("beastiepedia.sidebar.filter.other"),
            ]}
            className={styles.tabSelect}
          />
          {tab < 2 ? (
            <label>
              {L("common.searchPrefix")}
              <input
                type="search"
                onChange={(event) => setSearch(event.currentTarget.value)}
                onFocus={(event) => event.currentTarget.select()}
                value={search}
              />
            </label>
          ) : null}
          <div
            className={tab < 2 ? styles.listFlex : styles.list}
            onWheel={(event) => event.stopPropagation()}
          >
            {tab == 0 ? (
              beastie_abilities
                .filter(
                  (ability) =>
                    !search ||
                    filters.find(
                      (filter) =>
                        filter[0] == FilterTypes.Ability &&
                        filter[1].id == ability.id,
                    ) ||
                    L(ability.name)
                      .toLowerCase()
                      .includes(search.toLowerCase()),
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
                ))
            ) : tab == 1 ? (
              beastie_moves
                .filter(
                  (move) =>
                    !search ||
                    filters.find(
                      (filter) =>
                        filter[0] == FilterTypes.Move &&
                        filter[1].id == move.id,
                    ) ||
                    L(move.name).toLowerCase().includes(search.toLowerCase()),
                )
                .map((move) => (
                  <div
                    key={move.id}
                    onClick={() => handleToggleFilter([FilterTypes.Move, move])}
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
                ))
            ) : tab == 2 ? (
              <>
                {L("beastiepedia.sidebar.filter.allyTraining")}
                <br />
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
                    {L("common.types." + TRAINING_TYPES[type])}
                  </button>
                ))}
                <br />
                {L("beastiepedia.sidebar.filter.metamorphosis.title")}
                <br />
                <button
                  className={
                    metamorph === false ? styles.trainingSelected : undefined
                  }
                  onClick={() =>
                    handleToggleFilter([FilterTypes.Metamorphs, false], true)
                  }
                >
                  {L("beastiepedia.sidebar.filter.metamorphosis.doesNot")}
                </button>
                <button
                  className={
                    metamorph === true ? styles.trainingSelected : undefined
                  }
                  onClick={() =>
                    handleToggleFilter([FilterTypes.Metamorphs, true], true)
                  }
                >
                  {L("beastiepedia.sidebar.filter.metamorphosis.does")}
                </button>
                <br />
                {L("beastiepedia.sidebar.filter.metamorphosis.disclamer")}
                <br />
                {L("beastiepedia.sidebar.filter.recentlyUpdated.title")}
                <br />
                <button
                  className={
                    filters.some(
                      (filter) =>
                        filter[0] == FilterTypes.RecentlyUpdated &&
                        filter[1] == RecentlyUpdatedTypes.Stuff,
                    )
                      ? styles.trainingSelected
                      : undefined
                  }
                  onClick={() =>
                    handleToggleFilter(
                      [FilterTypes.RecentlyUpdated, RecentlyUpdatedTypes.Stuff],
                      true,
                    )
                  }
                >
                  {L(
                    "beastiepedia.sidebar.filter.recentlyUpdated.playsTraitsStats",
                  )}
                </button>
                <button
                  className={
                    filters.some(
                      (filter) =>
                        filter[0] == FilterTypes.RecentlyUpdated &&
                        filter[1] == RecentlyUpdatedTypes.Sprites,
                    )
                      ? styles.trainingSelected
                      : undefined
                  }
                  onClick={() =>
                    handleToggleFilter(
                      [
                        FilterTypes.RecentlyUpdated,
                        RecentlyUpdatedTypes.Sprites,
                      ],
                      true,
                    )
                  }
                >
                  {L(
                    "beastiepedia.sidebar.filter.recentlyUpdated.spritesColors",
                  )}
                </button>
              </>
            ) : null}
          </div>
        </Modal>
      </div>
    </div>
  );
}
