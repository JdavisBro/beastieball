import { useLocalStorage } from "usehooks-ts";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import SpoilerOptions from "./SpoilerOptions";
import { Link } from "react-router-dom";

function Toggles() {
  const [noAnimations, setNoAnimations] = useLocalStorage(
    "noAnimations",
    false,
    { serializer: String, deserializer: (value) => value == "true" },
  );
  const [tooltipsEnabled, setTooltipsEnabled] = useLocalStorage(
    "tooltipsEnabled",
    true,
  );
  const [tooltipsOnHover, setTooltipsOnHover] = useLocalStorage(
    "tooltipsOnHover",
    true,
  );
  return (
    <>
      <label className={styles.animationtoggle}>
        <input
          defaultChecked={noAnimations}
          type="checkbox"
          onChange={(event) => setNoAnimations(event.currentTarget.checked)}
        />
        Disable Animations
      </label>
      <label className={styles.animationtoggle}>
        <input
          defaultChecked={tooltipsEnabled}
          type="checkbox"
          onChange={(event) => setTooltipsEnabled(event.currentTarget.checked)}
        />
        Tooltips Enabled
      </label>
      <label className={styles.animationtoggle}>
        <input
          defaultChecked={tooltipsOnHover}
          type="checkbox"
          onChange={(event) => setTooltipsOnHover(event.currentTarget.checked)}
        />
        Show Tooltips On Hover
      </label>
    </>
  );
}

export default function Settings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const experimental = import.meta.env.VITE_EXPERIMENTAL == "true";
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
        <Toggles />
        <SpoilerOptions />
        {experimental || experimental_different ? (
          <Link to={experimental_target.href}>
            Visit the {experimental ? "non-experimental" : "🧪experimental"}{" "}
            site.
          </Link>
        ) : null}
      </div>
    </Modal>
  );
}
