import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../shared/Header";
import Sidebar from "./Sidebar";
import OpenGraph from "../shared/OpenGraph";
import styles from "./Beastiepedia.module.css";
import useScreenOrientation from "../utils/useScreenOrientation";
import BEASTIE_DATA from "../data/BeastieData";
import { BeastieType } from "../data/BeastieData";
import CustomErrorBoundary from "../shared/CustomErrorBoundary";
import ContentPreview from "./Preview/ContentPreview";
import ContentInfo from "./Info/ContentInfo";

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
        title={(beastie !== undefined ? `${beastie} - ` : "") + "Beastiepedia"}
        menuButton={true}
        menuButtonState={sidebarvisible}
        onMenuButtonPressed={() => setSidebarvisible((visible) => !visible)}
      />
      <div className={styles.belowheader}>
        <CustomErrorBoundary fallbackClassName={styles.sidebar}>
          <Sidebar
            beastieid={beastieid}
            visibility={sidebarvisible}
            onToggleSidebarVisibility={() => {
              if (orientation) {
                setSidebarvisible(false);
              }
            }}
          />
        </CustomErrorBoundary>
        <CustomErrorBoundary fallbackClassName={styles.content}>
          <div
            className={
              beastiedata
                ? sidebarvisible
                  ? styles.content
                  : styles.contentwide
                : sidebarvisible
                  ? styles.contentOff
                  : styles.contentOffWide
            }
          >
            {beastiedata ? (
              <>
                <CustomErrorBoundary fallbackClassName={styles.preview}>
                  <ContentPreview beastiedata={beastiedata} />
                </CustomErrorBoundary>
                <CustomErrorBoundary fallbackClassName={styles.info}>
                  <ContentInfo beastiedata={beastiedata} />
                </CustomErrorBoundary>
              </>
            ) : (
              <h1 className={styles.notselectedtext}>
                No Beastie Selected
                <br />
                {sidebarvisible
                  ? "Select a beastie in the sidebar"
                  : "Select a beastie by toggling the menu in the top left"}
                .
              </h1>
            )}
          </div>
        </CustomErrorBoundary>
      </div>
    </div>
  );
}
