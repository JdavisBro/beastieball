import { useState } from "react";

import Modal from "../shared/Modal";
import abilities from "../data/abilities";
import styles from "./Filter.module.css";
import BEASTIE_DATA from "../data/BeastieData";
import TextTag from "../shared/TextTag";

export enum FilterType {
  None,
  Ability,
}

const beastie_abilities: string[] = [];
BEASTIE_DATA.forEach((beastie) =>
  beastie.ability.forEach((ability) => {
    if (!beastie_abilities.includes(ability)) {
      beastie_abilities.push(ability);
    }
  }),
);
beastie_abilities.sort((abilityId, abilityId2) =>
  abilities[abilityId].name.localeCompare(abilities[abilityId2].name),
);

export default function Filter({
  filter,
  setFilter,
}: {
  filter: [FilterType, string];
  setFilter: (value: [FilterType, string]) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSetFilter = (
    event: React.MouseEvent,
    value: [FilterType, string],
  ) => {
    event.stopPropagation();
    setOpen(false);
    setFilter(value);
  };

  return (
    <div
      className={styles.filterButton}
      role="button"
      tabIndex={0}
      onClick={() => setOpen(true)}
    >
      <Modal
        header="Filter Beasties"
        open={open}
        onClose={() => setOpen(false)}
        hashValue="Filter"
      >
        <button
          onClick={(event) => handleSetFilter(event, [FilterType.None, ""])}
        >
          Clear Filter
        </button>
        <div>Abilities:</div>
        <div
          className={styles.abilityList}
          onWheel={(event) => event.stopPropagation()}
        >
          {beastie_abilities.map((abilityId) => (
            <div
              key={abilityId}
              role="button"
              onClick={(event) =>
                handleSetFilter(event, [FilterType.Ability, abilityId])
              }
              className={
                filter[0] == FilterType.Ability && filter[1] == abilityId
                  ? styles.abilitySelected
                  : styles.ability
              }
            >
              <div>{abilities[abilityId].name}</div>
              <div className={styles.abilityDesc}>
                <TextTag>{abilities[abilityId].desc}</TextTag>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
