// @flow strict
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "./Sidebar";
import styles from "./Beastiepedia.module.css";
import setTitle from "../utils/setTitle";

import BEASTIE_DATA from "./data/Beastiedata";
import Content from "./Content";

export default function Beastiepedia(): React$Node {
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
    useEffect(() => {
      window.history.replaceState(null, "", "/beastiepedia/");
    }, []);
    setTitle("Beastiepedia");
  }
  return (
    <div className={styles.container}>
      <Sidebar beastieid={beastieid}></Sidebar>
      <Content
        beastiedata={beastieid != null ? BEASTIE_DATA.get(beastieid) : null}
      ></Content>
    </div>
  );
}
