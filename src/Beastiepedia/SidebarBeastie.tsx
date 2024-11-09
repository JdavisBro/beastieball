import { Link, useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";
import type { BeastieType } from "../data/BeastieData";
import CustomErrorBoundary from "../shared/CustomErrorBoundary";
import {
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "../shared/useSpoiler";

type Props = {
  beastieid: string;
  beastiedata: BeastieType;
  statDisplay: string;
  selected: boolean;
  visible: boolean;
  onToggleSidebarVisibility: () => void;
};

export default function SidebarBeastie(props: Props): React.ReactElement {
  const beastiedata = props.beastiedata;
  const selected = props.selected;
  const content = selected
    ? `${styles.beastiecontent} ${styles.selected}`
    : styles.beastiecontent;

  const [spoilerMode] = useSpoilerMode();
  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();
  const isSpoiler =
    spoilerMode == SpoilerMode.OnlySeen && !seenBeasties[beastiedata.id];

  const navigate = useNavigate();

  const handleClick = () => {
    seenBeasties[beastiedata.id] = true;
    setSeenBeasties(seenBeasties);
    props.onToggleSidebarVisibility();
    if (isSpoiler) {
      navigate(`/beastiepedia/${beastiedata.name}`);
    }
  };

  return (
    <CustomErrorBoundary fallbackClassName={styles.beastie}>
      <Link
        to={isSpoiler ? "#" : `/beastiepedia/${beastiedata.name}`}
        className={styles.beastie}
        style={{ display: props.visible ? "block" : "none" }}
        onClick={handleClick}
      >
        <div className={content}>
          <img
            className={styles.image}
            src={
              isSpoiler
                ? "/gameassets/sprExclam_1.png"
                : `/icons/${beastiedata.name}.png`
            }
            style={isSpoiler ? { filter: "brightness(50%)" } : undefined}
            alt={`${isSpoiler ? "Hidden" : beastiedata.name} Icon`}
            loading="lazy"
          />
          <span className={styles.gridnumber}>
            <span className={styles.hash}>#</span>
            {String(beastiedata.number).padStart(2, "0")}
          </span>
          <span className={styles.gridnumberright}>
            {isSpoiler ? "" : props.statDisplay}
          </span>
          <div className={styles.name}>
            <div className={styles.number}>
              <span className={styles.hash}>#</span>
              <span>{String(beastiedata.number).padStart(2, "0")}</span>
              {props.statDisplay && !isSpoiler ? (
                <span> - {props.statDisplay}</span>
              ) : null}
            </div>
            <div>{isSpoiler ? "???" : beastiedata.name}</div>
          </div>
        </div>
      </Link>
    </CustomErrorBoundary>
  );
}
