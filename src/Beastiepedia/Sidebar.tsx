import SidebarBeastie from "./SidebarBeastie";
import styles from "./Beastiepedia.module.css";
import BEASTIE_DATA from "../data/Beastiedata";

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  onToggleSidebarVisibility: () => void;
};

export default function Sidebar(props: Props): React.ReactElement {
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
        onToggleSidebarVisibility={() => props.onToggleSidebarVisibility()}
      ></SidebarBeastie>
    );
  });
  return <div className={style}>{beasties}</div>;
}
