import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";
import dummy from "../assets/dummy.png";
import type { BeastieType } from "../data/BeastieType";

type Props = {
  beastieid: string;
  beastiedata: BeastieType;
  selected: boolean;
  useToggleSidebarVisibility: () => void;
};

export default function SidebarBeastie(props: Props): React.ReactElement {
  const beastiedata = props.beastiedata;
  const selected = props.selected;
  const navigate = useNavigate();
  const left = selected
    ? `${styles.beastiediagL} ${styles.selected}`
    : styles.beastiediagL;
  const content = selected
    ? `${styles.beastiecontent} ${styles.selected}`
    : styles.beastiecontent;
  const right = selected
    ? `${styles.beastiediagR} ${styles.selected}`
    : styles.beastiediagR;
  return (
    // GET BEASTIE ICON IMG
    <div
      className={styles.beastie}
      onClick={useCallback(() => {
        navigate("/beastiepedia/" + beastiedata.name);
        props.useToggleSidebarVisibility();
      }, [navigate, beastiedata, props])}
    >
      <div className={left}></div>
      <div className={content}>
        <img className={styles.image} src={dummy} />
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
      <div className={right}></div>
    </div>
  );
}
