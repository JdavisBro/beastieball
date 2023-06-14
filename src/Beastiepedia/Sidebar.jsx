// @flow strict

import styles from "./Sidebar.module.css";

import BEASTIE_DATA from "./data/Beastiedata";

import dummy from "../assets/dummy.png";
import Beastiepedia from "./Beastiepedia";
import SidebarBeastie from "./SidebarBeastie";

export default function Sidebar({ beastieid }): React$Node {
  let beasties = [];
  BEASTIE_DATA.forEach((value, key) => {
    beasties.push(
      <SidebarBeastie
        beastieid={key}
        beastiedata={value}
        selected={beastieid == key}
      ></SidebarBeastie>
    );
  });
  return <div className={styles.sidebar}>{beasties}</div>;
}
