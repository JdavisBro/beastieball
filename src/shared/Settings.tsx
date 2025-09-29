import { useLocalStorage } from "usehooks-ts";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import SpoilerOptions from "./SpoilerOptions";
import { Link } from "react-router-dom";
import { Language } from "./Language";
import useLocalization from "../localization/useLocalization";

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
  const { L } = useLocalization();

  return (
    <>
      <ToggleCheckbox
        storageKey="noAnimations"
        text={L("common.settings.disableAnimations")}
        hoverText={L("common.settings.disableAnimationsDesc")}
      />
      <ToggleCheckbox
        storageKey="simpleMoves"
        text={L("common.settings.simplePlay")}
        hoverText={L("common.settings.simplePlayDesc")}
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
  const { L } = useLocalization();

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
      header={L("common.settings.title", {
        branding: import.meta.env.VITE_BRANDING,
      })}
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
            {L("common.settings.visit", {
              version: experimental
                ? L("common.settings.normal")
                : L("common.settings.experimental"),
            })}
          </Link>
        ) : null}
      </div>
    </Modal>
  );
}
