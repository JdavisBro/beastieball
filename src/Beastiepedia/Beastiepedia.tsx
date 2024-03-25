import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import OpenGraph from "../shared/OpenGraph";
import styles from "./Beastiepedia.module.css";
import useScreenOrientation from "../utils/useScreenOrientation";
import BEASTIE_DATA from "../data/Beastiedata";
import { BeastieType } from "../data/BeastieType";

declare global {
  interface Window {
    BEASTIE_DATA: Map<string, BeastieType>;
    beastie: BeastieType | null | undefined;
  }
}

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
    !(beastieid !== null && orientation),
  ); // Selected beastie & portrait automatically hides sidebar

  const beastiedata = beastieid != null ? BEASTIE_DATA.get(beastieid) : null;

  window.BEASTIE_DATA = BEASTIE_DATA;
  window.beastie = beastiedata;

  return (
    <div className={styles.container}>
      <OpenGraph
        title={
          beastieid === null ? "Beastiepedia" : `${beastie} - Beastiepedia`
        }
        image={
          beastiedata
            ? `icons/${beastiedata.name}.png`
            : "gameassets/sprMainmenu/0.png" // beastiepedia icon
        }
        url={beastieid === null ? `beastiepedia/` : `beastiepedia/${beastie}`}
        description={
          beastiedata != null
            ? beastiedata.desc
            : "View information on Beasties!"
        }
      />
      <Header
        beastiename={beastie}
        sidebarvisibility={sidebarvisible}
        onSetSidebarVisibility={(visible: boolean) =>
          setSidebarvisible(visible)
        }
      />
      <div className={styles.belowheader}>
        <Sidebar
          beastieid={beastieid}
          visibility={sidebarvisible}
          onToggleSidebarVisibility={() => {
            if (orientation) {
              setSidebarvisible(false);
            }
          }}
        />
        <Content beastiedata={beastiedata} sidebarvisible={sidebarvisible} />
      </div>
    </div>
  );
}
