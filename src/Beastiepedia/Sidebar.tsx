import SidebarBeastie from "./SidebarBeastie";
import styles from "./Sidebar.module.css";
import BEASTIE_DATA from "../data/BeastieData";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  onToggleSidebarVisibility: () => void;
};

export default function Sidebar(props: Props): React.ReactElement {
  const beastieid = props.beastieid;
  const beasties: React.ReactElement[] = [];

  const [search, setSearch] = useState("");

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
        {beasties}
      </div>
    </div>
  );
}
