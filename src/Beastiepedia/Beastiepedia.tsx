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
import { useLocalStorage } from "usehooks-ts";

export default function Beastiepedia(): React.ReactNode {
  const orientation = useScreenOrientation();
  const { beastie }: { beastie?: string } = useParams();
  const [noAnimations, setNoAnimations] = useLocalStorage(
    "noAnimations",
    false,
    { serializer: String, deserializer: (value) => value == "true" },
  );

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

  let title = "Beastiepedia";
  let path: null | string = "/beastiepedia/";
  if (beastieid !== null && beastie !== undefined) {
    title = `${beastie} - Beastiepedia`;
    path = `/beastiepedia/${beastie}`;
  }
  useTitle(title, path);

  const beastiedata = beastieid != null ? BEASTIE_DATA.get(beastieid) : null;

  return (
    <div
      className={
        noAnimations ? `${styles.container} ${styles.noanim}` : styles.container
      }
    >
      <OpenGraph
        title={title}
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
        noAnimations={noAnimations}
        onSetNoAnimations={(noAnim: boolean) => setNoAnimations(noAnim)}
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
