import { BeastieColorSet, bgrDecimalToHex } from "../../utils/color";

type Props = {
    colors: BeastieColorSet;
    handleColorChange: (color: number) => void;
}

export default function BeastieColorSlider(props: Props) {
    const gradient_args = props.colors.map((value) => `#${bgrDecimalToHex(value.color)} ${Math.round(value.x*100)}%`)
    const gradient = `linear-gradient(90deg, ${gradient_args.join(", ")})`
    return <div style={{backgroundImage: gradient, width: "fit-content"}}>
        <input type="range" min={0} max={1} step={0.01} onChange={(e) => props.handleColorChange(Number(e.target.value))} />
    </div>
}