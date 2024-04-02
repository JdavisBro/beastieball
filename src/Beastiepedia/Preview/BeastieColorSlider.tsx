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
        step="any"
        value={props.value !== undefined ? props.value : 0.5}
        onChange={(e) => props.handleColorChange(Number(e.target.value))}
        onKeyDown={(e) => {
          const dir = e.key == "ArrowLeft" ? -1 : e.key == "ArrowRight" ? 1 : 0;
          if (dir != 0) {
            e.preventDefault();
            const newnum =
              Number((e.target as HTMLInputElement).value) +
              dir * (e.shiftKey ? 0.01 : 0.1);

            (e.target as HTMLInputElement).value = String(newnum);
            props.handleColorChange(newnum);
          }
        }}
      />
    </div>
  );
}
