import SidebarBeastie from "./SidebarBeastie";
import styles from "./Sidebar.module.css";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Filter, {
  createFilterFunction,
  createFilterString,
  FilterType,
} from "./Filter";
import { useIsSpoiler } from "../shared/useSpoiler";
import { useNavigate } from "react-router-dom";
import { SORT_CATEGORIES } from "./sortCategories";

const BEASTIES = [...BEASTIE_DATA.values()];

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
};

export default function Sidebar(props: Props): React.ReactElement {
  const beastieid = props.beastieid;

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState(SORT_CATEGORIES[0]);
  const [sortDec, setSortDec] = useState(false);
  const sortMult = sortDec ? -1 : 1;
  const sortFunc: (beastie1: BeastieType, beastie2: BeastieType) => number =
    sort.compare
      ? (beastie1, beastie2) => sort.compare(beastie1, beastie2) * sortMult
      : (beastie1, beastie2) =>
          (sort.value(beastie1) - sort.value(beastie2)) * sortMult ||
          beastie1.number - beastie2.number;
  const [grid, setGrid] = useLocalStorage("beastiepediaGrid", false);

  const [filters, setFilters] = useState<FilterType[]>([]);

  const filterFunc = createFilterFunction(filters);

  const [isSpoiler, setSeen] = useIsSpoiler();

  const navigate = useNavigate();

  const handleSpoiler = useCallback(
    (beastieId: string, name: string) => {
      setSeen(beastieId);
      navigate(`/beastiepedia/${name}`);
    },
    [setSeen, navigate],
  );

  return (
    <div className={props.visibility ? styles.sidebar : styles.sidebaroff}>
      <div className={styles.controlsContainer}>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search Beasties.."
            className={styles.sidebarsearch}
            onChange={(event) => setSearch(event.currentTarget.value)}
            onFocus={(event) => event.currentTarget.select()}
          />
          <select
            onChange={(event) =>
              setSort(
                SORT_CATEGORIES.find(
                  (sortCat) => sortCat.name == event.currentTarget.value,
                ) ?? SORT_CATEGORIES[0],
              )
            }
            className={styles.sidebarselect}
          >
            {SORT_CATEGORIES.map((sort) => (
              <option key={sort.name} value={sort.name}>
                {sort.name}
              </option>
            ))}
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
              sort.display ? sort.display(beastie, grid) : sort.value(beastie)
            }
            selected={beastieid == beastie.id}
            visible={
              beastie.name.toLowerCase().includes(search.toLowerCase()) &&
              (!filterFunc || filterFunc(beastie))
            }
            isSpoiler={isSpoiler(beastie.id)}
            handleSpoilerClick={handleSpoiler}
          />
        ))}
      </div>
    </div>
  );
}
