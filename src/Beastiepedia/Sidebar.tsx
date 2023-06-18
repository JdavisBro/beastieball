import styles from "./Beastiepedia.module.css";
import BEASTIE_DATA from "./data/Beastiedata";
import SidebarBeastie from "./SidebarBeastie";

type Props = {
  beastieid: string | null | undefined;
  visibility: boolean;
  useToggleSidebarVisibility: () => void;
};

export default function Sidebar(props: Props): React.ReactElement {
  const beastieid = props.beastieid;
  const beasties: React.ReactElement[] = [];
  const style = props.visibility ? styles.sidebar : `${styles.sidebar} ${styles.sidebaroff}`;
  BEASTIE_DATA.forEach((value, key) => {
    beasties.push(
      <SidebarBeastie
        key={key}
        beastieid={key}
        beastiedata={value}
        selected={beastieid == key}
        useToggleSidebarVisibility={() => props.useToggleSidebarVisibility()}
      ></SidebarBeastie>
    );
  });
  return <div className={style}>{beasties}</div>;
}