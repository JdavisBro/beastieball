import SidebarBeastie from "./SidebarBeastie";
import styles from "./Beastiepedia.module.css";
import BEASTIE_DATA from "../data/Beastiedata";
import { useState } from "react";

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  onToggleSidebarVisibility: () => void;
};

export default function Sidebar(props: Props): React.ReactElement {
  const [search, setSearch] = useState("");
  const beastieid = props.beastieid;
  const beasties: React.ReactElement[] = [];
  const style = props.visibility
    ? styles.sidebar
    : `${styles.sidebar} ${styles.sidebaroff}`;
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
    <div className={style}>
      <div className={styles.sidebarsearchcon}>
        <input
          type="text"
          placeholder="Search Beasties.."
          className={styles.sidebarsearch}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {beasties}
    </div>
  );
}
