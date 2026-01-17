import styles from "./Shared.module.css";
import githublogo from "../assets/github-mark-white.svg";
import Settings from "./Settings";
import { useState } from "react";
import useLocalization from "../localization/useLocalization";

export default function NavIcons(): React.ReactElement {
  const { L } = useLocalization();

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={styles.externallinks}>
      <a
        className={styles.navIcon}
        target="_blank"
        rel="noreferrer"
        title={L("common.navIcons.githubOpen")}
        href="https://github.com/JdavisBro/beastieball"
      >
        <img
          className={styles.externallinklogo}
          src={githublogo}
          alt={L("common.navIcons.githubImg")}
        />
      </a>
      <div
        role="button"
        className={styles.settingsButton}
        tabIndex={0}
        title={L("common.navIcons.settingsOpen", {
          branding: import.meta.env.VITE_BRANDING,
        })}
        onClick={() => setSettingsOpen(!settingsOpen)}
      >
        <img
          className={styles.settingslogo}
          src={"/gameassets/sprMainmenu/12.png"}
          alt={L("common.navIcons.settingsImg")}
        />
      </div>
      <div>
        <Settings open={settingsOpen} setOpen={setSettingsOpen} />
      </div>
    </div>
  );
}
