import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import styles from "./Beastiepedia.module.css";
import useTitle from "../utils/useTitle";
import useScreenOrientation from "../utils/useScreenOrientation";
import BEASTIE_DATA from "./data/Beastiedata";
import Content from "./Content";

export default function Beastiepedia(): React.ReactNode {
  const orientation = useScreenOrientation();
  const {beastie}: {beastie?: string} = useParams();
  let beastieid = null;

  if (beastie !== null) {
    BEASTIE_DATA.forEach((value, key) => {
      if (value.name == beastie) {
        beastieid = key;
      }
    });
  }
  
  const [sidebarvisible, setSidebarvisible] = useState(
    !(beastieid !== null && orientation)
  ); // Selected beastie & portrait automatically hides sidebar

  let title = "Beastiepedia"
  let path: null | string = null
  if (beastieid !== null && beastie !== null) {
    title = `${beastie} - Beastiepedia`;
  } else {
    path = "/beastiepedia/"
  }
  useTitle(title, path);

  return (
    <div className={styles.container}>
      <Sidebar beastieid={beastieid} visibility={sidebarvisible}></Sidebar>
      <Content
        beastiedata={beastieid != null ? BEASTIE_DATA.get(beastieid) : null}
      ></Content>
    </div>
  );
}
