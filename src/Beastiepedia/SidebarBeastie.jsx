// @flow strict

import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";

import dummy from "../assets/dummy.png";
import { useCallback } from "react";
import type { BeastieType } from "./data/BeastieType.js";

type Props = {
  beastieid: string,
  beastiedata: BeastieType,
  selected: boolean,
};

export default function SidebarBeastie(props: Props): React$Node {
  var beastieid = props.beastieid;
  var beastiedata = props.beastiedata;
  var selected = props.selected;
  const navigate = useNavigate();
  var left = selected
    ? `${styles.beastiediagL} ${styles.selected}`
    : styles.beastiediagL;
  var content = selected
    ? `${styles.beastiecontent} ${styles.selected}`
    : styles.beastiecontent;
  var right = selected
    ? `${styles.beastiediagR} ${styles.selected}`
    : styles.beastiediagR;
  return (
    // GET BEASTIE ICON IMG
    <div
      className={styles.beastie}
      onClick={useCallback(() => {
        navigate("/beastiepedia/" + beastiedata.name);
      })}
    >
      <div className={left}></div>
      <div className={content}>
        <img src={dummy} />
        <div>
          <div>#{beastiedata.number}</div>
          <div>{beastiedata.name}</div>
        </div>
      </div>
      <div className={right}></div>
    </div>
  );
}
