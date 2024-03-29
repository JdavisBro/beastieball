import { BeastieColorSet, bgrDecimalToHex } from "../../utils/color";
import styles from "./ColorTabs.module.css";

type Props = {
  colors: BeastieColorSet;
  value: number;
  handleColorChange: (color: number) => void;
};

export default function BeastieColorSlider(props: Props) {
  const same_color =
    props.colors.length == 1 ||
    props.colors.every((value) => value.color == props.colors[0].color);

  const gradient_args = props.colors.map(
    (value) => `#${bgrDecimalToHex(value.color)} ${Math.round(value.x * 100)}%`,
  );
  const gradient = `linear-gradient(90deg, ${gradient_args.join(", ")})`;
  return (
    <div
      className={styles.colorslider}
      style={
        same_color
          ? { backgroundColor: `#${bgrDecimalToHex(props.colors[0].color)}` }
          : { backgroundImage: gradient }
      }
    >
      <input
        type="range"
        disabled={same_color}
        min={0}
        max={1}
        step={0.0001}
        value={props.value !== undefined ? props.value : 0.5}
        onChange={(e) => props.handleColorChange(Number(e.target.value))}
      />
    </div>
  );
}
