// @flow strict
import { useParams } from "react-router-dom";

import Sidebar from "./Sidebar";
import styles from "./Beastiepedia.module.css";

import BEASTIE_DATA from "./data/Beastiedata";
import Content from "./Content";

export default function Beastiepedia(): React$Node {
  const { beastie } = useParams();
  var beastieid = null;
  if (beastie !== null) {
    BEASTIE_DATA.forEach((value, key) => {
      if (value.name == beastie) {
        beastieid = key;
      }
    });
  }
  return (
    <div>
      <div className={styles.container}>
        <Sidebar beastieid={beastieid}></Sidebar>
        <Content beastiedata={BEASTIE_DATA.get(beastieid)}></Content>
      </div>
    </div>
  );
}
