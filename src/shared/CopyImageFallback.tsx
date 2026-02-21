import useLocalization from "../localization/useLocalization";
import Modal from "./Modal";
import styles from "./Shared.module.css";

export default function CopyImageFallback({
  imageUrl,
  setImageUrl,
}: {
  imageUrl?: string;
  setImageUrl: (imageUrl?: string) => void;
}): React.ReactNode {
  const { L } = useLocalization();
  if (!imageUrl) {
    return null;
  }
  return (
    <Modal
      header={L("common.copyImageFallback.header")}
      open={imageUrl.length > 0}
      hashValue="CopyImage"
      onClose={() => setImageUrl(undefined)}
    >
      <div className={styles.copyImageFallback}>
        <div>{L("common.copyImageFallback.instructions")}</div>
        <img src={imageUrl} />
      </div>
    </Modal>
  );
}
