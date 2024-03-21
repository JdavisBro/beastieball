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
import BEASTIE_DATA from "../../data/Beastiedata";

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

  const [storedColors, setStoredColors] = useLocalStorage<{
    [key: string]: [number[], number[], string[]];
  }>(
    "beastiecolors",
    {},
    { serializer: JSON.stringify, deserializer: JSON.parse },
  );

  const [diffBeastieColors, setDiffBeastieColors] = useState<string | null>(
    "none",
  );

  const DiffBeastieSetter = useCallback(
    (props: { tab: number }) => (
      <>
        <label
          htmlFor={`otherbeastiesel${props.tab}`}
          style={{ color: "black" }}
        >
          {" "}
          Other Beastie Colors:{" "}
        </label>
        <select
          name={`otherbeastiesel${props.tab}`}
          id={`otherbeastiesel${props.tab}`}
          onChange={(event) => setDiffBeastieColors(event.target.value)}
        >
          <option value="none">None</option>
          {Array.from(BEASTIE_DATA).map(([key, value]) => {
            return (
              <option key={key} value={key}>
                {value.name}
              </option>
            );
          })}
        </select>
      </>
    ),
    [],
  );

  let beastiedata = props.beastiedata;
  if (diffBeastieColors && diffBeastieColors != "none") {
    const newbeastiedata = BEASTIE_DATA.get(diffBeastieColors);
    if (newbeastiedata != undefined) {
      beastiedata = newbeastiedata;
    }
  }

  const colors = useMemo(
    () => [...Array(beastiedata.colors.length).keys()],
    [beastiedata],
  );

  const currentBeastie = useRef("");

  const [currentTab, setCurrentTab] = useState(0);
  const tabValues = useRef<[number[], number[], string[]]>(
    defaultColors(colors, beastiedata),
  );

  useEffect(() => {
    // reset colors on beastie change
    if (currentBeastie.current != beastiedata.id) {
      currentBeastie.current = beastiedata.id;
      if (storedColors[beastiedata.id] && diffBeastieColors == "none") {
        tabValues.current = storedColors[beastiedata.id];
      } else {
        tabValues.current = defaultColors(colors, beastiedata);
      }
    }
  }, [beastiedata, colors, storedColors, diffBeastieColors]);

  const saveStoredColor = useCallback(() => {
    if (diffBeastieColors != "none") {
      return;
    }
    setStoredColors((old) => {
      old[beastiedata.id] = tabValues.current;
      return old;
    });
  }, [beastiedata, setStoredColors, diffBeastieColors]);

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
  }, [currentTab, beastiedata.id, setCustomColor, setBeastieColor]);

  const ResetColorButton = useCallback(
    (props: { tab: number }) => (
      <button
        onClick={() => {
          tabValues.current[props.tab] = defaultColors(colors, beastiedata)[
            props.tab
          ];
          saveStoredColor();
          tabValues.current[props.tab].forEach((value, index) =>
            typeof value == "string"
              ? setCustomColor(index, value)
              : setBeastieColor(props.tab, index, value),
          );
        }}
      >
        Reset Colors
      </button>
    ),
    [beastiedata, colors, saveStoredColor, setBeastieColor, setCustomColor],
  );

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
            colors={beastiedata.colors[value].array}
            value={tabValues.current[0][value]}
            handleColorChange={(color) => setBeastieColor(0, value, color)}
          />
        ))}
        <ResetColorButton tab={0} />
        <DiffBeastieSetter tab={0} />
      </div>
      <div
        className={styles.tab}
        style={{ display: currentTab == 1 ? "block" : "none" }}
      >
        {colors.map((value) => (
          <BeastieColorSlider
            key={value}
            colors={beastiedata.shiny[value].array}
            value={tabValues.current[1][value]}
            handleColorChange={(color) => setBeastieColor(1, value, color)}
          />
        ))}
        <ResetColorButton tab={1} />
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
        <br />
        <ResetColorButton tab={2} />
      </div>
    </>
  );
}
