import { useCallback, useEffect, useRef, useState } from "react";

import BeastieColorSlider from "./BeastieColorSlider";
import styles from "./ColorTabs.module.css";
import {
  bgrDecimalToHex,
  getColorInBeastieColors,
  hexToRgb,
} from "../../utils/color";
import type { BeastieType } from "../../data/BeastieType";

type Props = {
  beastiedata: BeastieType;
  colorChange: (change_index: number, color: number[]) => void;
};

function defaultColors(
  colors: number[],
  beastiedata: BeastieType,
): [number[], number[], string[]] {
  return [
    colors.map(() => 0.5),
    colors.map(() => 0.5),
    colors.map((value) =>
      bgrDecimalToHex(beastiedata.colors[value].array[0].color),
    ),
  ];
}

export default function ColorTabs(props: Props): React.ReactNode {
  const colorChange = props.colorChange;
  const beastiedata = props.beastiedata;
  const colors = [...Array(beastiedata.colors.length).keys()];

  const [currentTab, setCurrentTab] = useState(0);
  const tabValues = useRef<[number[], number[], string[]]>(
    defaultColors(colors, beastiedata),
  );

  useEffect(() => {
    // reset colors on beastie change
    tabValues.current = defaultColors(colors, beastiedata);
  }, [beastiedata]);

  const setBeastieColor = useCallback(
    (tab_index: number, color_index: number, color: number) => {
      tabValues.current[tab_index][color_index] = color;
      colorChange(
        color_index,
        getColorInBeastieColors(
          color,
          tab_index == 0
            ? beastiedata.colors[color_index].array
            : beastiedata.shiny[color_index].array,
        ),
      );
    },
    [colorChange, beastiedata],
  );

  const setCustomColor = useCallback(
    (color_index: number, color: string) => {
      tabValues.current[2][color_index] = color.replace(/^#/, "");
      colorChange(color_index, hexToRgb(color));
    },
    [colorChange],
  );

  useEffect(() => {
    tabValues.current[currentTab].forEach((value, index) =>
      typeof value == "string"
        ? setCustomColor(index, value)
        : setBeastieColor(currentTab, index, value),
    );
  }, [currentTab, props.beastiedata.id, setCustomColor, setBeastieColor]);

  return (
    <>
      <div className={styles.tabselect}>
        <button
          className={currentTab == 0 ? styles.selectedtab : ""}
          onClick={() => setCurrentTab(0)}
        >
          Regular
        </button>
        <button
          className={currentTab == 1 ? styles.selectedtab : ""}
          onClick={() => setCurrentTab(1)}
        >
          Shiny
        </button>
        <button
          className={currentTab == 2 ? styles.selectedtab : ""}
          onClick={() => setCurrentTab(2)}
        >
          Custom
        </button>
      </div>
      <div
        className={styles.tab}
        style={{ display: currentTab == 0 ? "block" : "none" }}
      >
        {colors.map((value) => (
          <BeastieColorSlider
            key={value}
            colors={props.beastiedata.colors[value].array}
            value={tabValues.current[0][value]}
            handleColorChange={(color) => setBeastieColor(0, value, color)}
          />
        ))}
      </div>
      <div
        className={styles.tab}
        style={{ display: currentTab == 1 ? "block" : "none" }}
      >
        {colors.map((value) => (
          <BeastieColorSlider
            key={value}
            colors={props.beastiedata.shiny[value].array}
            value={tabValues.current[1][value]}
            handleColorChange={(color) => setBeastieColor(1, value, color)}
          />
        ))}
      </div>
      <div
        className={styles.tab}
        style={{ display: currentTab == 2 ? "block" : "none" }}
      >
        {tabValues.current[2].map((value, index) => (
          <input
            key={index}
            className={styles.customcolor}
            type="color"
            value={`#${value}`}
            onChange={(e) => setCustomColor(index, e.target.value)}
          />
        ))}
      </div>
    </>
  );
}
