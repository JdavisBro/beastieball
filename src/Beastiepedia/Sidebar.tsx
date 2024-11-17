import SidebarBeastie from "./SidebarBeastie";
import styles from "./Sidebar.module.css";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Filter, { FilterType } from "./Filter";

const BEASTIES = [...BEASTIE_DATA.values()];

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  onToggleSidebarVisibility: () => void;
};

type StatType = "ba" | "bd" | "ha" | "hd" | "ma" | "md";
const STATS: StatType[] = ["ba", "bd", "ha", "hd", "ma", "md"];

function getBeastieStatTotal(beastie: BeastieType) {
  return STATS.reduce((accum, stat) => accum + beastie[stat], 0);
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
      : sort == "total"
        ? (beastie1, beastie2) =>
            (getBeastieStatTotal(beastie1) - getBeastieStatTotal(beastie2)) *
            sortMult
        : (beastie1, beastie2) =>
            ((beastie1[sort as keyof BeastieType] as number) -
              (beastie2[sort as keyof BeastieType] as number)) *
            sortMult;

  const [grid, setGrid] = useLocalStorage("beastiepediaGrid", false);

  const [filter, setFilter] = useState<[FilterType, string]>([
    FilterType.None,
    "",
  ]);

  const filterFunc =
    filter[0] == FilterType.Ability
      ? (beastie: BeastieType) => beastie.ability.includes(filter[1])
      : undefined;

  return (
    <div className={props.visibility ? styles.sidebar : styles.sidebaroff}>
      <div className={styles.sidebarsearchcon}>
        <input
          type="text"
          placeholder="Search Beasties.."
          className={styles.sidebarsearch}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select onChange={(event) => setSort(event.target.value)}>
          <option value="number">Number</option>
          <option value="name">Name</option>
          <option value="total">Stat Total</option>
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
        <Filter filter={filter} setFilter={setFilter} />
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
                ? sort == "total"
                  ? String(getBeastieStatTotal(beastie))
                  : (beastie[sort as keyof BeastieType] as string)
                : ""
            }
            smallStatDisplay={sort == "name"}
            selected={beastieid == beastie.id}
            visible={
              beastie.name.toLowerCase().includes(search.toLowerCase()) &&
              (!filterFunc || filterFunc(beastie))
            }
            onToggleSidebarVisibility={() => props.onToggleSidebarVisibility()}
          />
        ))}
      </div>
    </div>
  );
}
