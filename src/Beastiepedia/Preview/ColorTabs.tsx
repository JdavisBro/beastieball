import { useRef, useState } from "react";
import type { BeastieType } from "../../data/BeastieType";
import { getColorInBeastieColors } from "../../utils/color";
import BeastieColorSlider from "./BeastieColorSlider";

type Props = {
  beastiedata: BeastieType;
  colorChange: (change_index: number, color: number[]) => void;
};

export default function ColorTabs(props: Props): React.ReactNode {
    const colors = props.beastiedata.colors.length;
    const colorarray = [...Array(colors).keys()]

    const [currentTab, setCurrentTab] = useState(0);
    const tabValues = useRef([
        colorarray.map(() => 0.5),
        colorarray.map(() => 0.5),
        colorarray.map((value) => props.beastiedata.colors[value].array),
    ]);

    const setBeastieColor = (tab_index: number, color_index: number, color: number) => {
        tabValues.current[tab_index][color_index] = color;
        props.colorChange(color_index, getColorInBeastieColors(color, props.beastiedata.colors[color_index].array));
    }

    return <>
        <BeastieColorSlider colors={props.beastiedata.colors[0].array} handleColorChange={(color) => setBeastieColor(0, 0, color)} />
        <BeastieColorSlider colors={props.beastiedata.colors[1].array} handleColorChange={(color) => setBeastieColor(0, 1, color)} />
        <BeastieColorSlider colors={props.beastiedata.colors[2].array} handleColorChange={(color) => setBeastieColor(0, 2, color)} />
    </>
}
