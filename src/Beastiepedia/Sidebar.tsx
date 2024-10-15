import SidebarBeastie from "./SidebarBeastie";
import styles from "./Sidebar.module.css";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const BEASTIES = [...BEASTIE_DATA.values()];

function statCmp(stat: keyof BeastieType) {
  return (beastie1: BeastieType, beastie2: BeastieType) =>
    (beastie1[stat] as number) - (beastie2[stat] as number);
}

const SORT_FUNCTIONS: ((
  beastie1: BeastieType,
  beastie2: BeastieType,
) => number)[] = [
  statCmp("number"),
  statCmp("ba"),
  statCmp("bd"),
  statCmp("ha"),
  statCmp("hd"),
  statCmp("ma"),
  statCmp("md"),
];

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  onToggleSidebarVisibility: () => void;
};

export default function Sidebar(props: Props): React.ReactElement {
  const beastieid = props.beastieid;
  const beasties: React.ReactElement[] = [];

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState(0);
  const [sortDec, setSortDec] = useState(false);
  const sortFunc = (beastie1: BeastieType, beastie2: BeastieType) =>
    SORT_FUNCTIONS[sort](beastie1, beastie2) * (sortDec ? -1 : 1);

  const [grid, setGrid] = useLocalStorage("beastiepediaGrid", false);

  BEASTIE_DATA.forEach((value, key) => {
    beasties.push(
      <SidebarBeastie
        key={key}
        beastieid={key}
        beastiedata={value}
        selected={beastieid == key}
        visible={value.name.toLowerCase().includes(search.toLowerCase())}
        onToggleSidebarVisibility={() => props.onToggleSidebarVisibility()}
      />,
    );
  });
  return (
    <div className={props.visibility ? styles.sidebar : styles.sidebaroff}>
      <div className={styles.sidebarsearchcon}>
        <input
          type="text"
          placeholder="Search Beasties.."
          className={styles.sidebarsearch}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select onChange={(event) => setSort(Number(event.target.value))}>
          <option value="0">Number</option>
          <option value="1">Body POW</option>
          <option value="2">Body DEF</option>
          <option value="3">Spirit POW</option>
          <option value="4">Spirit DEF</option>
          <option value="5">Mind POW</option>
          <option value="6">Mind DEF</option>
        </select>
        <button onClick={() => setSortDec(!sortDec)}>
          {sortDec ? "↓" : "↑"}
        </button>
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
            selected={beastieid == beastie.id}
            visible={beastie.name.toLowerCase().includes(search.toLowerCase())}
            onToggleSidebarVisibility={() => props.onToggleSidebarVisibility()}
          />
        ))}
      </div>
    </div>
  );
}
