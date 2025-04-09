import { useLocalStorage } from "usehooks-ts";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import SpoilerOptions from "./SpoilerOptions";
import { Link } from "react-router-dom";

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
  const experimental = true;
  const experimental_different =
    import.meta.env.VITE_EXPERIMENTAL_DIFFERENT == "true";
  const experimental_target = new URL(location.href);
  experimental_target.hash = "";
  experimental_target.hostname = experimental
    ? import.meta.env.VITE_URL_NORMAL
    : import.meta.env.VITE_URL_EXPERIMENTAL;

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
        {experimental || experimental_different ? (
          <Link to={experimental_target.href}>Visit the normal site.</Link>
        ) : null}
      </div>
    </Modal>
  );
}
