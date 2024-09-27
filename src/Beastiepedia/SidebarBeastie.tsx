import { Link } from "react-router-dom";

import styles from "./Sidebar.module.css";
import type { BeastieType } from "../data/BeastieData";
import CustomErrorBoundary from "../shared/CustomErrorBoundary";

type Props = {
  beastieid: string;
  beastiedata: BeastieType;
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
  return (
    <CustomErrorBoundary fallbackClassName={styles.beastie}>
      <Link
        to={`/beastiepedia/${beastiedata.name}`}
        className={styles.beastie}
        style={{ display: props.visible ? "block" : "none" }}
        onClick={props.onToggleSidebarVisibility}
      >
        <div className={content}>
          <img
            className={styles.image}
            src={`/icons/${beastiedata.name}.png`}
            alt={`${beastiedata.name} Icon`}
            loading="lazy"
          />
          <span className={styles.gridnumber}>
            <span className={styles.hash}>#</span>
            {String(beastiedata.number).padStart(2, "0")}
          </span>
          <div className={styles.name}>
            <div>
              <div>
                <span className={styles.hash}>#</span>
                <span className={styles.number}>
                  {String(beastiedata.number).padStart(2, "0")}
                </span>
              </div>
              <div>{beastiedata.name}</div>
            </div>
          </div>
        </div>
      </Link>
    </CustomErrorBoundary>
  );
}
