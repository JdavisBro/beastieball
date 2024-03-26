import ContentInfo from "./Info/ContentInfo";
import ContentPreview from "./Preview/ContentPreview";
import styles from "./Beastiepedia.module.css";
import previewstyles from "./Content.module.css";
import type { BeastieType } from "../data/BeastieType";
import CustomErrorBoundary from "../shared/CustomErrorBoundary";

type Props = {
  beastiedata: BeastieType | null | undefined;
  sidebarvisible: boolean;
};

export default function Content(props: Props): React.ReactNode {
  const beastiedata = props.beastiedata;

  if (beastiedata) {
    return (
      <div
        className={
          props.sidebarvisible
            ? styles.content
            : `${styles.content} ${styles.contentwide}`
        }
      >
        <CustomErrorBoundary fallbackClassName={previewstyles.preview}>
          <ContentPreview beastiedata={beastiedata} />
        </CustomErrorBoundary>
        <CustomErrorBoundary fallbackClassName={previewstyles.info}>
          <ContentInfo beastiedata={beastiedata} />
        </CustomErrorBoundary>
      </div>
    );
  } else {
    return (
      <div
        className={
          props.sidebarvisible
            ? `${styles.content} ${styles.contentnotselected}`
            : `${styles.content} ${styles.contentnotselected} ${styles.contentwide}`
        }
      >
        <h1 className={styles.notselectedtext}>
          No Beastie Selected
          <br />
          {props.sidebarvisible
            ? "Select a beastie in the sidebar"
            : "Select a beastie by toggling the menu in the top left"}
          .
        </h1>
      </div>
    );
  }
}
