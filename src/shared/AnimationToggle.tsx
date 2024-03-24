import { useLocalStorage } from "usehooks-ts";

import styles from "./Shared.module.css";

export default function AnimationToggle(props: { break?: boolean }) {
  const [noAnimations, setNoAnimations] = useLocalStorage(
    "noAnimations",
    false,
    { serializer: String, deserializer: (value) => value == "true" },
  );
  return (
    <div className={styles.animationtoggle}>
      <input
        defaultChecked={noAnimations}
        id="noAnim"
        type="checkbox"
        onChange={(e) => setNoAnimations(e.target.checked)}
      />
      <label htmlFor="noAnim">
        Disable
        {props.break ? <br /> : " "}
        Animations
      </label>
    </div>
  );
}
