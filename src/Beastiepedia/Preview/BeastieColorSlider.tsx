import { BeastieColorSet, bgrDecimalToHex } from "../../utils/color";
import styles from "./ColorTabs.module.css";

type Props = {
  colors: BeastieColorSet;
  value: number;
  handleColorChange: (color: number) => void;
};

export default function BeastieColorSlider(props: Props) {
  const gradient_args = props.colors.map(
    (value) => `#${bgrDecimalToHex(value.color)} ${Math.round(value.x * 100)}%`,
  );
  const gradient = `linear-gradient(90deg, ${gradient_args.join(", ")})`;
  return (
    <div
      className={styles.colorslider}
      style={
        props.colors.length > 1
          ? { backgroundImage: gradient }
          : { backgroundColor: `#${bgrDecimalToHex(props.colors[0].color)}` }
      }
    >
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={props.value}
        onChange={(e) => props.handleColorChange(Number(e.target.value))}
      />
    </div>
  );
}
