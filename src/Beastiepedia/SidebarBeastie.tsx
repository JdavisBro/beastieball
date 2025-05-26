import { Link } from "react-router-dom";

import styles from "./Sidebar.module.css";
import type { BeastieType } from "../data/BeastieData";
import { memo } from "react";
import useLocalization from "../localization/useLocalization";

type Props = {
  beastieid: string;
  beastiedata: BeastieType;
  statDisplay?: React.ReactNode;
  selected: boolean;
  visible: boolean;
  isSpoiler: boolean;
  handleClick: () => void;
  handleSpoilerClick: (beastieId: string, name: string) => void;
};

function SidebarBeastie(props: Props): React.ReactElement {
  const { L, getLink } = useLocalization();

  const beastiedata = props.beastiedata;
  const beastieName = L(beastiedata.name);
  const beastieEnName = L(beastiedata.name, undefined, true);

  const selected = props.selected;
  const content = selected
    ? `${styles.beastiecontent} ${styles.selected}`
    : styles.beastiecontent;

  return (
    <Link
      to={props.isSpoiler ? "#" : getLink(`/beastiepedia/${beastieName}`)}
      className={styles.beastie}
      style={{ display: props.visible ? "block" : "none" }}
      onClick={() => {
        props.handleClick();
        if (props.isSpoiler) {
          props.handleSpoilerClick(beastiedata.id, beastieName);
        }
      }}
    >
      <div className={content}>
        <img
          className={styles.image}
          src={
            props.isSpoiler
              ? "/gameassets/sprExclam_1.png"
              : `/icons/${beastieEnName}.png`
          }
          style={props.isSpoiler ? { filter: "brightness(50%)" } : undefined}
          alt={props.isSpoiler ? L("common.hiddenBeastie") : beastieName}
          loading="lazy"
        />
        <div className={styles.gridInfo}>
          <div className={styles.gridnumber}>
            <span className={styles.hash}>#</span>
            {String(beastiedata.number).padStart(2, "0")}
          </div>
          <div className={styles.gridInfoMiddle}></div>
          <div className={styles.gridnumberright}>
            {props.isSpoiler ? "" : props.statDisplay}
          </div>
        </div>
        <div className={styles.name}>
          <div className={styles.number}>
            <span className={styles.hash}>#</span>
            <span>{String(beastiedata.number).padStart(2, "0")}</span>
            {props.statDisplay && !props.isSpoiler ? (
              <span>
                {L("beastiepedia.sidebar.statDisplaySeparator")}
                <span className={styles.statDisplay}>{props.statDisplay}</span>
              </span>
            ) : null}
          </div>
          <div>{props.isSpoiler ? L("common.spoiler") : beastieName}</div>
        </div>
      </div>
    </Link>
  );
}

export default memo(SidebarBeastie);
