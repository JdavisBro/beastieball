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
import {
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "../shared/useSpoiler";
import { useNavigate } from "react-router-dom";
import { SORT_CATEGORIES } from "./sortCategories";
import useLocalization from "../localization/useLocalization";

const BEASTIES = [...BEASTIE_DATA.values()];

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  onToggleSidebarVisibility: () => void;
};

export default function Sidebar(props: Props): React.ReactElement {
  const { currentLanguage, L } = useLocalization();
  const beastieid = props.beastieid;

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState(SORT_CATEGORIES[0]);
  const [sortDec, setSortDec] = useState(false);
  const sortMult = sortDec ? -1 : 1;
  const sortFunc: (beastie1: BeastieType, beastie2: BeastieType) => number =
    sort.compare
      ? (beastie1, beastie2) => sort.compare(beastie1, beastie2, L) * sortMult
      : (beastie1, beastie2) =>
          (sort.value(beastie1, L) - sort.value(beastie2, L)) * sortMult ||
          beastie1.number - beastie2.number;
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
      navigate(
        `${currentLanguage == "en" ? "/" : `/${currentLanguage}/`}beastiepedia/${name}`,
      );
    },
    [setSeenBeasties, navigate, currentLanguage],
  );

  return (
    <div className={props.visibility ? styles.sidebar : styles.sidebaroff}>
      <div className={styles.controlsContainer}>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder={L("beastiepedia.sidebar.search")}
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
                {L("beastiepedia.sidebar.sort." + sort.name)}
              </option>
            ))}
          </select>
          <button onClick={() => setSortDec(!sortDec)}>
            {sortDec
              ? L("beastiepedia.sidebar.sort.descending")
              : L("beastiepedia.sidebar.sort.ascending")}
          </button>
          <Filter filters={filters} setFilters={setFilters} />
          <div
            className={grid ? styles.gridimage : styles.gridimageGrid}
            tabIndex={0}
            title={L("beastiepedia.sidebar.toggleGrid")}
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
          {filters ? createFilterString(filters, L) : null}
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
              sort.display
                ? sort.display(beastie, grid, L)
                : sort.value(beastie, L)
            }
            selected={beastieid == beastie.id}
            visible={
              L(beastie.name).toLowerCase().includes(search.toLowerCase()) &&
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
