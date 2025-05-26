import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { useSpoilerSeen } from "../shared/useSpoiler";
import useLocalization from "../localization/useLocalization";

declare global {
  interface Window {
    BEASTIE_DATA: Map<string, BeastieType>;
    beastie: BeastieType | null | undefined;
  }
}

export default function Beastiepedia(): React.ReactNode {
  const { L, getLink, beastieNames } = useLocalization();

  const orientation = useScreenOrientation();
  const { beastie }: { beastie?: string } = useParams();

  const [beastieid, beastiedata] = useMemo(() => {
    if (beastie) {
      for (const [key, value] of BEASTIE_DATA) {
        if (
          Object.values(
            beastieNames[value.name.slice(1, value.name.length - 1)],
          ).includes(beastie)
        ) {
          return [key, value];
        }
      }
    }
    return [undefined, undefined];
  }, [beastieNames, beastie]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!beastiedata || beastie == L(beastiedata.name)) {
      return;
    }
    navigate(
      {
        pathname: getLink(`/beastiepedia/${L(beastiedata.name)}`),
        hash: location.hash,
      },
      { replace: true },
    );
  }, [L, getLink, beastie, beastiedata, navigate]);

  const [sidebarvisible, setSidebarvisible] = useState(
    !(beastieid !== undefined && orientation),
  ); // Selected beastie & portrait automatically hides sidebar

  const handleDisableSidebar = useCallback(() => {
    if (orientation) {
      setSidebarvisible(false);
    }
  }, [orientation]);

  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();
  useEffect(() => {
    if (beastiedata && !seenBeasties[beastiedata.id]) {
      seenBeasties[beastiedata.id] = true;
      setSeenBeasties(seenBeasties);
    }
  }, [beastiedata, seenBeasties, setSeenBeasties]);

  window.BEASTIE_DATA = BEASTIE_DATA;
  window.beastie = beastiedata;

  const pageTitle = beastiedata
    ? L("beastiepedia.titleBeastie", { beastie: L(beastiedata.name) })
    : L("beastiepedia.title");

  return (
    <div className={styles.container}>
      <OpenGraph
        title={pageTitle}
        image={
          beastiedata ? `icons/${beastie}.png` : "gameassets/sprMainmenu/0.png" // beastiepedia icon
        }
        url={beastiedata ? `beastiepedia/${beastie}` : `beastiepedia/`}
        description={
          beastiedata ? L(beastiedata.desc) : L("beastiepedia.description")
        }
      />
      <Header
        title={pageTitle}
        menuButton={true}
        menuButtonState={sidebarvisible}
        onMenuButtonPressed={() => setSidebarvisible((visible) => !visible)}
      />
      <div className={styles.belowheader}>
        <CustomErrorBoundary fallbackClassName={styles.sidebar}>
          <Sidebar
            beastieid={beastieid}
            visibility={sidebarvisible}
            onToggleSidebarVisibility={handleDisableSidebar}
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
                {L("beastiepedia.noBeastie.text")}
                <br />
                {sidebarvisible
                  ? L("beastiepedia.noBeastie.menuEnabled")
                  : L("beastiepedia.noBeastie.menuDisabled")}
              </h1>
            )}
          </div>
        </CustomErrorBoundary>
      </div>
    </div>
  );
}
