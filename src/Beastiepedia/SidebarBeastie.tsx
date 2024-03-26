import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";
import type { BeastieType } from "../data/BeastieType";
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
  const navigate = useNavigate();
  const content = selected
    ? `${styles.beastiecontent} ${styles.selected}`
    : styles.beastiecontent;
  function handleInteract() {
    navigate("/beastiepedia/" + beastiedata.name);
    props.onToggleSidebarVisibility();
  }
  return (
    <CustomErrorBoundary fallbackClassName={styles.beastie}>
      <div
        className={styles.beastie}
        tabIndex={0}
        onClick={() => handleInteract()}
        // prettier-ignore
        onKeyDown={((event) => {if (event.key == "Enter") {handleInteract()}})}
        role="button"
        style={{ display: props.visible ? "block" : "none" }}
      >
        <div className={content}>
          <img
            className={styles.image}
            src={`/icons/${beastiedata.name}.png`}
            alt={`${beastiedata.name} Icon`}
            loading="lazy"
          />
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
      </div>
    </CustomErrorBoundary>
  );
}
