// @flow strict
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "./Sidebar";
import styles from "./Beastiepedia.module.css";
import setTitle from "../utils/setTitle";
import useScreenOrientation from "../utils/useScreenOrientation";

import BEASTIE_DATA from "./data/Beastiedata";
import MOVE_DATA from "./data/Movedata";
import Content from "./Content";

export default function Beastiepedia(): React$Node {
  const orientation = useScreenOrientation();
  const { beastie }: { beastie: string } = useParams();
  var beastieid = null;
  if (beastie !== null) {
    BEASTIE_DATA.forEach((value, key) => {
      if (value.name == beastie) {
        beastieid = key;
      }
    });
  }
  if (beastieid !== null && beastie !== null) {
    setTitle(`${beastie} - Beastiepedia`);
  } else {
    setTitle("Beastiepedia", "/beastiepedia/");
  }
  const [sidebarvisible, setSidebarvisible] = useState(
    // Selected beastie & portrait/mobile
    !(beastieid !== null && orientation)
  );
  return (
    <div className={styles.container}>
      <Sidebar beastieid={beastieid} visibility={sidebarvisible}></Sidebar>
      <Content
        beastiedata={beastieid != null ? BEASTIE_DATA.get(beastieid) : null}
      ></Content>
    </div>
  );
}
