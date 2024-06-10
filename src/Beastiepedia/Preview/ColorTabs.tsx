import { useEffect, useMemo, useRef, useState } from "react";

import BeastieColorSlider from "./BeastieColorSlider";
import styles from "./ColorTabs.module.css";
import {
  BeastieColorSet,
  getColorInBeastieColors,
  hexToRgb,
} from "../../utils/color";
import type { BeastieType } from "../../data/BeastieType";
import { useLocalStorage } from "usehooks-ts";
import BEASTIE_DATA from "../../data/Beastiedata";

function defaultColor(
  colors: number[],
  beastieColors: Array<{ array: BeastieColorSet }>,
) {
  return {
    color: colors.map(() => 0.5),
    color2: colors.map(() => 0.5),
    shiny: colors.map(() => 0.5),
    custom: colors.map((value) =>
      value < beastieColors.length
        ? getColorInBeastieColors(0.5, beastieColors[value].array).reduce(
            (prev, value) =>
              prev +
              Math.floor(value * 255)
                .toString(16)
                .padStart(2, "0"),
            "#",
          )
        : "#ffffff",
    ),
  };
}

type Props = {
  beastiedata: BeastieType;
  colorChange: (change_index: number, color: number[]) => void;
};

type StoredType = {
  [key: string]: {
    color: number[];
    color2: number[];
    shiny: number[];
    custom: string[];
  };
};

export default function ColorTabs(props: Props): React.ReactNode {
  const colorChange = props.colorChange;

  const [diffBeastieColors, setDiffBeastieColors] = useState("none");

  const [currentTabActual, setCurrentTab] = useState("color");

  let beastiedata = props.beastiedata;
  if (diffBeastieColors && diffBeastieColors != "none") {
    const newbeastiedata = BEASTIE_DATA.get(diffBeastieColors);
    if (newbeastiedata != undefined) {
      beastiedata = newbeastiedata;
    }
  }

  const colors = useMemo(
    () => [
      ...Array(
        Math.max(beastiedata.colors.length, props.beastiedata.colors.length),
      ).keys(),
    ],
    [beastiedata, props.beastiedata],
  );

  const currentTab =
    !beastiedata.colors2 && currentTabActual == "color2"
      ? "color"
      : currentTabActual;

  const [storedColors, setStoredColors] = useLocalStorage<StoredType>(
    "beastiecolors",
    {},
    { serializer: JSON.stringify, deserializer: JSON.parse },
  );
  if (
    storedColors[props.beastiedata.id] &&
    Array.isArray(storedColors[props.beastiedata.id])
  ) {
    storedColors[props.beastiedata.id] = defaultColor(
      colors,
      props.beastiedata.colors,
    );
  }

  const [customColors, setCustomColors] = useState<string[]>(
    diffBeastieColors == "none" && storedColors[beastiedata.id]
      ? storedColors[beastiedata.id].custom
      : defaultColor(colors, beastiedata.colors).custom,
  );

  const isCustomTab = currentTab == "custom";
  useEffect(() => {
    if (!isCustomTab) {
      return;
    }
    const beastieColors =
      diffBeastieColors == "none" && storedColors[beastiedata.id]
        ? storedColors[beastiedata.id]
        : defaultColor(colors, beastiedata.colors);
    beastieColors.custom.forEach((value, index) =>
      colorChange(index, hexToRgb(value)),
    );
    setCustomColors(beastieColors.custom);
  }, [
    isCustomTab,
    beastiedata,
    colorChange,
    colors,
    diffBeastieColors,
    storedColors,
  ]);

  return (
    <>
      <div className={styles.tabselect}>
        <button
          className={currentTab == "color" ? styles.selectedtab : ""}
          onClick={() => setCurrentTab("color")}
        >
          Regular
        </button>
        {beastiedata.colors2 ? (
          <button
            className={currentTab == "color2" ? styles.selectedtab : ""}
            onClick={() => setCurrentTab("color2")}
          >
            Alt Colors
          </button>
        ) : null}
        <button
          className={currentTab == "shiny" ? styles.selectedtab : ""}
          onClick={() => setCurrentTab("shiny")}
        >
          Raremorph
        </button>
        <button
          className={currentTab == "custom" ? styles.selectedtab : ""}
          onClick={() => setCurrentTab("custom")}
        >
          Custom
        </button>
      </div>
      <div className={styles.tabcontainer}>
        <BeastieColorTabContent
          tab={"color"}
          currentTab={currentTab}
          colorMax={colors}
          colors={beastiedata.colors}
          fallbackColors={props.beastiedata.colors}
          beastieid={props.beastiedata.id}
          diffBeastie={diffBeastieColors}
          storedColors={storedColors}
          setStoredColors={setStoredColors}
          colorChange={colorChange}
        />
        {beastiedata.colors2 != null ? (
          <BeastieColorTabContent
            tab={"color2"}
            currentTab={currentTab}
            colorMax={colors}
            colors={beastiedata.colors2}
            fallbackColors={beastiedata.colors}
            beastieid={props.beastiedata.id}
            diffBeastie={diffBeastieColors}
            storedColors={storedColors}
            setStoredColors={setStoredColors}
            colorChange={colorChange}
          />
        ) : null}
        <BeastieColorTabContent
          tab={"shiny"}
          currentTab={currentTab}
          colorMax={colors}
          colors={beastiedata.shiny}
          fallbackColors={props.beastiedata.shiny}
          beastieid={props.beastiedata.id}
          diffBeastie={diffBeastieColors}
          storedColors={storedColors}
          setStoredColors={setStoredColors}
          colorChange={colorChange}
        />
        <div
          className={styles.tab}
          style={{ display: currentTab == "custom" ? "block" : "none" }}
        >
          {customColors.map((value, index) => (
            <input
              key={index}
              className={styles.customcolor}
              type="color"
              value={`${value}`}
              onChange={(e) => {
                colorChange(index, hexToRgb(e.target.value));
                if (diffBeastieColors != "none") {
                  return;
                }
                setStoredColors((oldColors) => {
                  if (!oldColors[beastiedata.id]) {
                    oldColors[beastiedata.id] = defaultColor(
                      colors,
                      beastiedata.colors,
                    );
                  }
                  oldColors[beastiedata.id].custom[index] = e.target.value;
                  return oldColors;
                });
              }}
            />
          ))}
          <br />
          <button
            onClick={() => {
              if (
                diffBeastieColors != "none" ||
                !storedColors[beastiedata.id]
              ) {
                return;
              }
              setStoredColors((oldStored) => {
                oldStored[beastiedata.id].custom = defaultColor(
                  colors,
                  beastiedata.colors,
                ).custom;
                return oldStored;
              });
            }}
            disabled={diffBeastieColors != "none"}
          >
            Reset Colors
          </button>
        </div>
        <label htmlFor="otherbeastiesel" style={{ color: "black" }}>
          {" "}
          Other Beastie Colors:{" "}
        </label>
        <select
          name="otherbeastiesel"
          id="otherbeastiesel"
          value={diffBeastieColors}
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
      </div>
    </>
  );
}
function BeastieColorTabContent(props: {
  tab: "color" | "color2" | "shiny";
  currentTab: string;
  colorMax: number[];
  colors: Array<{ array: Array<{ color: number; x: number }> }>;
  fallbackColors: Array<{ array: Array<{ color: number; x: number }> }>;
  beastieid: string;
  diffBeastie: string;
  storedColors: StoredType;
  setStoredColors: React.Dispatch<React.SetStateAction<StoredType>>;
  colorChange: (change_index: number, color: number[]) => void;
}) {
  const current = props.tab == props.currentTab;

  const colorValues = useRef(props.colorMax.map(() => 0.5));

  const lastValue = useRef([false, "", ""]);
  const currentValue = [current, props.beastieid, props.diffBeastie];
  const changed = lastValue.current.some(
    (value, index) => value == currentValue[index],
  );
  lastValue.current = currentValue;

  const {
    tab,
    colorChange,
    diffBeastie,
    storedColors,
    beastieid,
    colorMax,
    colors,
    fallbackColors,
  } = props;

  useEffect(() => {
    if (!current || !changed) {
      return;
    }
    if (diffBeastie == "none") {
      if (storedColors[beastieid]) {
        colorValues.current = storedColors[beastieid][tab];
      } else {
        colorValues.current = colorMax.map(() => 0.5);
      }
    } else {
      colorValues.current = colorMax.map(() => 0.5);
    }
    colorValues.current.forEach((value, index) =>
      colorChange(
        index,
        getColorInBeastieColors(
          value,
          index < colors.length
            ? colors[index].array
            : fallbackColors[index].array,
        ),
      ),
    );
  }, [
    changed,
    current,
    tab,
    beastieid,
    colorMax,
    colors,
    diffBeastie,
    fallbackColors,
    storedColors,
    colorChange,
  ]);

  return (
    <div className={styles.tab} style={{ display: current ? "block" : "none" }}>
      {props.colorMax.map((value) =>
        value < Math.max(props.colors.length, props.fallbackColors.length) ? (
          <BeastieColorSlider
            key={value}
            colors={
              value < props.colors.length
                ? props.colors[value].array
                : props.fallbackColors[value].array
            }
            value={colorValues.current[value]}
            handleColorChange={(newColor) => {
              props.colorChange(
                value,
                getColorInBeastieColors(
                  newColor,
                  value < props.colors.length
                    ? props.colors[value].array
                    : props.fallbackColors[value].array,
                ),
              );
              colorValues.current[value] = newColor;
              if (props.diffBeastie == "none") {
                props.setStoredColors((oldStored) => {
                  if (!oldStored[props.beastieid]) {
                    oldStored[props.beastieid] = defaultColor(
                      props.colorMax,
                      props.colors,
                    );
                  }
                  oldStored[props.beastieid][props.tab] = colorValues.current;
                  return oldStored;
                });
              }
            }}
          />
        ) : null,
      )}
      <button
        onClick={() => {
          if (
            props.diffBeastie != "none" ||
            !props.storedColors[props.beastieid]
          ) {
            return;
          }
          props.setStoredColors((oldStored) => {
            oldStored[props.beastieid][tab] = defaultColor(
              props.colorMax,
              props.colors,
            )[tab];
            return oldStored;
          });
        }}
      >
        Reset Colors
      </button>
    </div>
  );
}
