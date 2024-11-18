import { useLocalStorage } from "usehooks-ts";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import SpoilerOptions from "./SpoilerOptions";

function AnimationToggle() {
  const [noAnimations, setNoAnimations] = useLocalStorage(
    "noAnimations",
    false,
    { serializer: String, deserializer: (value) => value == "true" },
  );
  return (
    <label className={styles.animationtoggle}>
      <input
        defaultChecked={noAnimations}
        type="checkbox"
        onChange={(event) => setNoAnimations(event.currentTarget.checked)}
      />
      Disable Animations
    </label>
  );
}

export default function Settings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      header={`${import.meta.env.VITE_BRANDING} Settings`}
      open={open}
      hashValue={"Settings"}
      onClose={onClose}
    >
      <div className={styles.settingsContainer}>
        <AnimationToggle />
        <SpoilerOptions />
      </div>
    </Modal>
  );
}
