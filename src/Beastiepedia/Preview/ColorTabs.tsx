import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BeastieColorSlider from "./BeastieColorSlider";
import styles from "./ColorTabs.module.css";
import {
  bgrDecimalToHex,
  getColorInBeastieColors,
  hexToRgb,
} from "../../utils/color";
import type { BeastieType } from "../../data/BeastieType";
import { useLocalStorage } from "usehooks-ts";

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

  const [storedColors, setStoredColors] = useLocalStorage<{
    [key: string]: [number[], number[], string[]];
  }>(
    "beastiecolors",
    {},
    { serializer: JSON.stringify, deserializer: JSON.parse },
  );

  const colors = useMemo(
    () => [...Array(beastiedata.colors.length).keys()],
    [beastiedata],
  );

  const [currentTab, setCurrentTab] = useState(0);
  const tabValues = useRef<[number[], number[], string[]]>(
    defaultColors(colors, beastiedata),
  );

  const currentBeastie = useRef("");

  useEffect(() => {
    // reset colors on beastie change
    if (currentBeastie.current != beastiedata.id) {
      currentBeastie.current = beastiedata.id;
      if (storedColors[beastiedata.id]) {
        tabValues.current = storedColors[beastiedata.id];
      } else {
        tabValues.current = defaultColors(colors, beastiedata);
      }
    }
  }, [beastiedata, colors, storedColors]);

  const saveStoredColor = useCallback(() => {
    setStoredColors((old) => {
      old[beastiedata.id] = tabValues.current;
      return old;
    });
  }, [beastiedata, setStoredColors]);

  const setBeastieColor = useCallback(
    (tab_index: number, color_index: number, color: number) => {
      tabValues.current[tab_index][color_index] = color;
      saveStoredColor();
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
    [colorChange, beastiedata, saveStoredColor],
  );

  const setCustomColor = useCallback(
    (color_index: number, color: string) => {
      tabValues.current[2][color_index] = color.replace(/^#/, "");
      saveStoredColor();
      colorChange(color_index, hexToRgb(color));
    },
    [colorChange, saveStoredColor],
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
      <button
        onClick={() => {
          tabValues.current[currentTab] = defaultColors(colors, beastiedata)[
            currentTab
          ];
          saveStoredColor();
          tabValues.current[currentTab].forEach((value, index) =>
            typeof value == "string"
              ? setCustomColor(index, value)
              : setBeastieColor(currentTab, index, value),
          );
        }}
      >
        Reset Colors
      </button>
    </>
  );
}
