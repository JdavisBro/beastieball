// @flow strict

import styles from "./Beastiepedia.module.css";

import BEASTIE_DATA from "./data/Beastiedata";

import dummy from "../assets/dummy.png";
import SidebarBeastie from "./SidebarBeastie";

type Props = {
  beastieid: ?string,
};

export default function Sidebar(props: Props): React$Node {
  var beastieid = props.beastieid;
  let beasties = [];
  BEASTIE_DATA.forEach((value, key) => {
    beasties.push(
      <SidebarBeastie
        key={key}
        beastieid={key}
        beastiedata={value}
        selected={beastieid == key}
      ></SidebarBeastie>
    );
  });
  return <div className={styles.sidebar}>{beasties}</div>;
}
