import { useLocalStorage } from "usehooks-ts";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import SpoilerOptions from "./SpoilerOptions";
import { Link } from "react-router-dom";
import { Language } from "./Language";

function ToggleCheckbox({
  storageKey,
  text,
  defaultValue,
  hoverText,
}: {
  storageKey: string;
  text: string;
  defaultValue?: boolean;
  hoverText?: string;
}) {
  const [value, setValue] = useLocalStorage(storageKey, defaultValue ?? false);
  return (
    <label className={styles.animationtoggle} title={hoverText}>
      <input
        checked={value}
        type="checkbox"
        onChange={(event) => setValue(event.currentTarget.checked)}
      />{" "}
      {text}
    </label>
  );
}

function Toggles() {
  return (
    <>
      <ToggleCheckbox
        storageKey="noAnimations"
        text="Disable Animations"
        hoverText="Removes background and header scrolling animations which can be distracting and has an impact on performance."
      />
      <ToggleCheckbox
        storageKey="simpleMoves"
        text="Simple Play Background"
        hoverText="Disables halftones on Play boxes, which has an impact on performance when there are many."
      />
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
        <Language />
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
