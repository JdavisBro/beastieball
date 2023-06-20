import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import OpenGraph from "../shared/OpenGraph";
import styles from "./Beastiepedia.module.css";
import useTitle from "../utils/useTitle";
import useScreenOrientation from "../utils/useScreenOrientation";
import BEASTIE_DATA from "../data/Beastiedata";
import dummy from "../assets/dummy.png";

export default function Beastiepedia(): React.ReactNode {
  const orientation = useScreenOrientation();
  const { beastie }: { beastie?: string } = useParams();
  let beastieid: string | null = null;

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

  let title = "Beastiepedia";
  let path: null | string = null;
  if (beastieid !== null && beastie !== undefined) {
    title = `${beastie} - Beastiepedia`;
  } else {
    path = "/beastiepedia/";
  }
  useTitle(title, path);

  const beastiedata = beastieid != null ? BEASTIE_DATA.get(beastieid) : null;

  return (
    <div className={styles.container}>
      <OpenGraph
        title={title}
        image={dummy}
        url={beastieid === null ? `beastiepedia/` : `beastiepedia/${beastie}`}
        description={
          beastiedata != null
            ? beastiedata.desc
            : "View information on Beasties!"
        }
      ></OpenGraph>
      <Header
        beastiename={beastie}
        sidebarvisibility={sidebarvisible}
        onSetSidebarVisibility={(visible: boolean) =>
          setSidebarvisible(visible)
        }
      ></Header>
      <div className={styles.belowheader}>
        <Sidebar
          beastieid={beastieid}
          visibility={sidebarvisible}
          onToggleSidebarVisibility={() => {
            if (orientation) {
              setSidebarvisible(false);
            }
          }}
        ></Sidebar>
        <Content
          beastiedata={beastiedata}
          sidebarvisible={sidebarvisible}
        ></Content>
      </div>
    </div>
  );
}
