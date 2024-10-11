import { useEffect, useMemo, useRef, useState } from "react";

import BeastieColorSlider from "./BeastieColorSlider";
import styles from "./ColorTabs.module.css";
import {
  BeastieColorSet,
  getColorInBeastieColors,
  hexToRgb,
} from "../../utils/color";
import type { BeastieType } from "../../data/BeastieData";
import { useLocalStorage } from "usehooks-ts";
import BEASTIE_DATA from "../../data/BeastieData";
import BeastieSelect from "../../shared/BeastieSelect";

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

  useEffect(() => {
    // doesn't change tab automatically on dev because of double render
    const url = new URL(window.location.href);
    if (!url.search) {
      return;
    }
    if (!storedColors[props.beastiedata.id]) {
      storedColors[props.beastiedata.id] = defaultColor(
        colors,
        beastiedata.colors,
      );
    }
    for (const [key, value] of url.searchParams) {
      switch (key) {
        case "color": {
          url.searchParams.delete("color");
          setCurrentTab("color");
          storedColors[props.beastiedata.id].color = value
            .split(",")
            .map((v) => Number(v));
          break;
        }
        case "alt": {
          url.searchParams.delete("alt");
          if (!props.beastiedata.colors2) {
            break;
          }
          setCurrentTab("color2");
          storedColors[props.beastiedata.id].color2 = value
            .split(",")
            .map((v) => Number(v));
          break;
        }
        case "raremorph": {
          setCurrentTab("shiny");
          storedColors[props.beastiedata.id].shiny = value
            .split(",")
            .map((v) => Number(v));
          break;
        }
        case "custom": {
          setCurrentTab("custom");
          storedColors[props.beastiedata.id].custom = value.split(",");
        }
      }
    }
    setStoredColors(storedColors);
    url.search = "";
    window.history.pushState(null, "", url.toString());
  }, [
    props.beastiedata,
    setStoredColors,
    storedColors,
    beastiedata.colors,
    colors,
  ]);

  const validStoredColors =
    storedColors[beastiedata.id] &&
    !Array.isArray(storedColors[beastiedata.id]);

  const [customColors, setCustomColors] = useState<string[]>(
    diffBeastieColors == "none" && validStoredColors
      ? storedColors[beastiedata.id].custom
      : defaultColor(colors, beastiedata.colors).custom,
  );

  const isCustomTab = currentTab == "custom";
  useEffect(() => {
    if (!isCustomTab) {
      return;
    }
    const beastieColors =
      diffBeastieColors == "none" && validStoredColors
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
    validStoredColors,
  ]);

  const updateAllCustomColors = (newColors: string[]) => {
    newColors.forEach((col, index) => colorChange(index, hexToRgb(col)));
    setCustomColors(newColors);
    if (diffBeastieColors == "none") {
      setStoredColors((oldColors) => {
        if (
          !oldColors[beastiedata.id] ||
          Array.isArray(oldColors[beastiedata.id])
        ) {
          oldColors[beastiedata.id] = defaultColor(colors, beastiedata.colors);
        }
        oldColors[beastiedata.id].custom = newColors;

        return oldColors;
      });
    }
  };

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
                  if (
                    !oldColors[beastiedata.id] ||
                    Array.isArray(oldColors[beastiedata.id])
                  ) {
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
            onClick={() =>
              updateAllCustomColors(
                defaultColor(colors, beastiedata.colors).custom,
              )
            }
          >
            Reset Colors
          </button>
          <button
            onClick={() =>
              updateAllCustomColors(
                colors.map(() =>
                  [0, 0, 0]
                    .map(() => Math.round(Math.random() * 255))
                    .reduce(
                      (accum, value) =>
                        accum + value.toString(16).padStart(2, "0"),
                      "#",
                    ),
                ),
              )
            }
          >
            Randomize Colors
          </button>
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set(
                "custom",
                storedColors[props.beastiedata.id].custom.join(","),
              );
              navigator.clipboard.writeText(url.toString());
            }}
          >
            Copy Link with Colors
          </button>
        </div>
        <label
          htmlFor="otherbeastiesel"
          style={{ color: "black", marginLeft: "20px" }}
        >
          {" "}
          Other Beastie Colors:{" "}
        </label>
        <BeastieSelect
          beastieId={diffBeastieColors}
          setBeastieId={(beastieId: undefined | string) =>
            setDiffBeastieColors(beastieId ? beastieId : "none")
          }
        />
      </div>
    </>
  );
}

const TAB_SEARCH_ARG = { color: "color", color2: "alt", shiny: "raremorph" };

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
      if (storedColors[beastieid] && !Array.isArray(storedColors[beastieid])) {
        colorValues.current = storedColors[beastieid][tab];
      } else {
        colorValues.current = colorMax.map(() => 0.5);
      }
    } else {
      colorValues.current = colorMax.map(() => 0.5);
    }
    colorValues.current.forEach((value, index) => {
      if (index >= colorMax.length) {
        return;
      }
      colorChange(
        index,
        getColorInBeastieColors(
          value,
          index < colors.length
            ? colors[index].array
            : fallbackColors[index].array,
        ),
      );
    });
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

  const setColors = (colors: number[]) => {
    colorValues.current = colors;
    colors.forEach((col, index) => {
      colorChange(
        index,
        getColorInBeastieColors(
          col,
          index < props.colors.length
            ? props.colors[index].array
            : props.fallbackColors[index].array,
        ),
      );
    });
    if (diffBeastie == "none") {
      props.setStoredColors((oldStored) => {
        if (
          !oldStored[props.beastieid] ||
          Array.isArray(oldStored[props.beastieid])
        ) {
          oldStored[props.beastieid] = defaultColor(
            props.colorMax,
            props.colors,
          );
        }
        oldStored[props.beastieid][tab] = colorValues.current;
        return oldStored;
      });
    }
  };

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
                  if (
                    !oldStored[props.beastieid] ||
                    Array.isArray(oldStored[props.beastieid])
                  ) {
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
      <button onClick={() => setColors(colorMax.map(() => 0.5))}>
        Reset Colors
      </button>
      <button onClick={() => setColors(colorMax.map(() => Math.random()))}>
        Randomize Colors
      </button>
      <button
        onClick={() => {
          const url = new URL(window.location.href);
          url.searchParams.set(
            TAB_SEARCH_ARG[props.tab],
            colorValues.current.join(","),
          );
          navigator.clipboard.writeText(url.toString());
        }}
      >
        Copy Link with Colors
      </button>
    </div>
  );
}
