import styles from "./Beastiepedia.module.css";
import ContentInfo from "./ContentInfo";
import ContentPreview from "./ContentPreview";
import MOVE_DATA from "./data/Movedata";
import type {BeastieType} from "./data/BeastieType";

type Props = {
    beastiedata: BeastieType | null | undefined;
};
export default function Content(props: Props): React.ReactNode {
    const beastiedata = props.beastiedata;

    if (beastiedata) {
        return (
            <div className={styles.content}>
                <ContentPreview beastiedata={beastiedata}></ContentPreview>
                <ContentInfo beastiedata={beastiedata}></ContentInfo>
            </div>
        );
    } else {
        return (
            <div className={`${styles.content} ${styles.contentnotselected}`}>
                <h1 className={styles.notselectedtext}>
                    No Beastie Selected
                    <br />
                    Select a beastie on the left.
                </h1>
            </div>
        );
    }
}