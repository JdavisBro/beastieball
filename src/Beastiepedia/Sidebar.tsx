import SidebarBeastie from "./SidebarBeastie";
import styles from "./Sidebar.module.css";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Filter, { createFilterString, FilterType, FilterTypes } from "./Filter";
import {
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "../shared/useSpoiler";
import { useNavigate } from "react-router-dom";

const BEASTIES = [...BEASTIE_DATA.values()];

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  onToggleSidebarVisibility: () => void;
};

type StatType = "ba" | "bd" | "ha" | "hd" | "ma" | "md";
const STATS: StatType[] = ["ba", "bd", "ha", "hd", "ma", "md"];

const OTHER_SORT_DATA: Record<string, (beastie: BeastieType) => number> = {
  total: (beastie) => STATS.reduce((accum, stat) => accum + beastie[stat], 0),
  pow: (beastie) => beastie.ba + beastie.ha + beastie.ma,
  def: (beastie) => beastie.bd + beastie.hd + beastie.md,
};

function createFilterFunction(filters: FilterType[]) {
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
      }
    });
}

export default function Sidebar(props: Props): React.ReactElement {
  const beastieid = props.beastieid;

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("number");
  const [sortDec, setSortDec] = useState(false);
  const sortMult = sortDec ? -1 : 1;
  const sortFunc: (beastie1: BeastieType, beastie2: BeastieType) => number =
    sort == "name"
      ? (beastie1, beastie2) =>
          beastie1.name.localeCompare(beastie2.name) * sortMult
      : OTHER_SORT_DATA[sort]
        ? (beastie1, beastie2) =>
            (OTHER_SORT_DATA[sort](beastie1) -
              OTHER_SORT_DATA[sort](beastie2)) *
            sortMult
        : (beastie1, beastie2) =>
            ((beastie1[sort as keyof BeastieType] as number) -
              (beastie2[sort as keyof BeastieType] as number)) *
            sortMult;

  const [grid, setGrid] = useLocalStorage("beastiepediaGrid", false);

  const [filters, setFilters] = useState<FilterType[]>([]);

  const filterFunc = createFilterFunction(filters);

  const [spoilerMode] = useSpoilerMode();
  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();

  const navigate = useNavigate();

  const handleSpoiler = useCallback(
    (beastieId: string, name: string) => {
      setSeenBeasties((prev) => {
        prev[beastieId] = true;
        return prev;
      });
      navigate(`/beastiepedia/${name}`);
    },
    [setSeenBeasties, navigate],
  );

  return (
    <div className={props.visibility ? styles.sidebar : styles.sidebaroff}>
      <div className={styles.controlsContainer}>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search Beasties.."
            className={styles.sidebarsearch}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <select
            onChange={(event) => setSort(event.currentTarget.value)}
            className={styles.sidebarselect}
          >
            <option value="number">Number</option>
            <option value="name">Name</option>
            <option value="total">Stat Total</option>
            <option value="pow">POW Total</option>
            <option value="def">DEF Total</option>
            <option value="ba">Body POW</option>
            <option value="bd">Body DEF</option>
            <option value="ha">Spirit POW</option>
            <option value="hd">Spirit DEF</option>
            <option value="ma">Mind POW</option>
            <option value="md">Mind DEF</option>
          </select>
          <button onClick={() => setSortDec(!sortDec)}>
            {sortDec ? "↓" : "↑"}
          </button>
          <Filter filters={filters} setFilters={setFilters} />
          <div
            className={grid ? styles.gridimage : styles.gridimageGrid}
            tabIndex={0}
            title="Toggle Grid View"
            role="button"
            onClick={() => setGrid(!grid)}
            onKeyDown={(event) => {
              if (event.key == "Enter") {
                setGrid(!grid);
              }
            }}
          />
        </div>
        <div className={styles.filterText}>
          {filters ? createFilterString(filters) : null}
        </div>
      </div>
      <div
        className={grid ? styles.beastiecontainergrid : styles.beastiecontainer}
      >
        {BEASTIES.sort(sortFunc).map((beastie) => (
          <SidebarBeastie
            key={beastie.id}
            beastieid={beastie.id}
            beastiedata={beastie}
            statDisplay={
              sort != "number" && !(!grid && sort == "name")
                ? OTHER_SORT_DATA[sort]
                  ? String(OTHER_SORT_DATA[sort](beastie))
                  : (beastie[sort as keyof BeastieType] as string)
                : ""
            }
            smallStatDisplay={sort == "name"}
            selected={beastieid == beastie.id}
            visible={
              beastie.name.toLowerCase().includes(search.toLowerCase()) &&
              (!filterFunc || filterFunc(beastie))
            }
            isSpoiler={
              spoilerMode == SpoilerMode.OnlySeen && !seenBeasties[beastie.id]
            }
            handleClick={props.onToggleSidebarVisibility}
            handleSpoilerClick={handleSpoiler}
          />
        ))}
      </div>
    </div>
  );
}
