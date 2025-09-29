import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import useLocalization from "../../localization/useLocalization";
import InfoTabberHeader from "../../shared/InfoTabber";

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
  rowdy: boolean;
  setRowdy: (rowdy: boolean) => void;
};

type StoredType = {
  [key: string]: {
    color: number[];
    color2: number[];
    shiny: number[];
    custom: string[];
  };
};

type HookType = [StoredType, React.Dispatch<React.SetStateAction<StoredType>>];

function isNumberArray(array: unknown) {
  return Array.isArray(array) && array.every((a) => typeof a == "number");
}

function useStoredTypes(): HookType {
  const [storedColors, setStoredColors] = useLocalStorage<StoredType>(
    "beastiecolors",
    {},
    { serializer: JSON.stringify, deserializer: JSON.parse },
  );
  const storedOk = typeof storedColors == "object";
  const setHook = useCallback(
    (colors: StoredType | ((colors: StoredType) => StoredType)) => {
      if (typeof colors == "function") {
        setStoredColors(colors(storedOk ? storedColors : {}));
      } else {
        setStoredColors(colors);
      }
    },
    [storedOk],
  );
  if (!storedOk) {
    return [{}, setHook];
  }
  for (const beastieId of Object.keys(storedColors)) {
    if (
      Array.isArray(storedColors[beastieId]) ||
      typeof storedColors[beastieId] != "object" ||
      !isNumberArray(storedColors[beastieId].color) ||
      !isNumberArray(storedColors[beastieId].color2) ||
      !isNumberArray(storedColors[beastieId].shiny) ||
      !(
        Array.isArray(storedColors[beastieId].custom) &&
        storedColors[beastieId].custom.every((a) => typeof a == "string")
      )
    ) {
      delete storedColors[beastieId];
    }
  }
  return [storedColors, setHook];
}

export default function ColorTabs(props: Props): React.ReactNode {
  const { L } = useLocalization();

  const colorChange = props.colorChange;

  const [diffBeastieColors, setDiffBeastieColors] = useState("none");

  const [currentTabActual, setCurrentTab] = useState("color");

  const isDiffBeastie =
    diffBeastieColors != "none" && diffBeastieColors != props.beastiedata.id;

  let beastiedata = props.beastiedata;
  if (isDiffBeastie) {
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

  const [storedColors, setStoredColors] = useStoredTypes();

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
    !isDiffBeastie && validStoredColors
      ? colors.map(
          (index) => storedColors[beastiedata.id].custom[index] ?? "#ffffff",
        )
      : defaultColor(colors, beastiedata.colors).custom,
  );

  const isCustomTab = currentTab == "custom";
  useEffect(() => {
    if (!isCustomTab) {
      return;
    }
    const beastieColors =
      !isDiffBeastie && validStoredColors
        ? colors.map(
            (index) => storedColors[beastiedata.id].custom[index] ?? "#ffffff",
          )
        : defaultColor(colors, beastiedata.colors).custom;
    beastieColors.forEach((value, index) =>
      colorChange(index, hexToRgb(value)),
    );
    setCustomColors(beastieColors);
  }, [
    isCustomTab,
    beastiedata,
    colorChange,
    colors,
    isDiffBeastie,
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
      <InfoTabberHeader
        tab={currentTab}
        setTab={setCurrentTab}
        tabs={{
          color: L("common.color.regular"),
          ...(beastiedata.colors2 ? { color2: L("common.color.variant") } : {}),
          shiny: L("common.color.raremorph"),
          custom: L("beastiepedia.preview.color.custom"),
        }}
      />
      <div className={styles.tabcontainer}>
        <BeastieColorTabContent
          tab={"color"}
          currentTab={currentTab}
          colorMax={colors}
          colors={beastiedata.colors}
          fallbackColors={props.beastiedata.colors}
          beastieid={props.beastiedata.id}
          isDiffBeastie={isDiffBeastie}
          storedColors={storedColors}
          setStoredColors={setStoredColors}
          colorChange={colorChange}
          linkedColors={beastiedata.linked_colors}
        />
        {beastiedata.colors2 != null ? (
          <BeastieColorTabContent
            tab={"color2"}
            currentTab={currentTab}
            colorMax={colors}
            colors={beastiedata.colors2}
            fallbackColors={
              isDiffBeastie
                ? (props.beastiedata.colors2 ?? props.beastiedata.colors)
                : beastiedata.colors
            }
            beastieid={props.beastiedata.id}
            isDiffBeastie={isDiffBeastie}
            storedColors={storedColors}
            setStoredColors={setStoredColors}
            colorChange={colorChange}
            linkedColors={beastiedata.linked_colors}
          />
        ) : null}
        <BeastieColorTabContent
          tab={"shiny"}
          currentTab={currentTab}
          colorMax={colors}
          colors={beastiedata.shiny}
          fallbackColors={props.beastiedata.shiny}
          beastieid={props.beastiedata.id}
          isDiffBeastie={isDiffBeastie}
          storedColors={storedColors}
          setStoredColors={setStoredColors}
          colorChange={colorChange}
          linkedColors={beastiedata.linked_colors}
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
              onChange={(event) => {
                colorChange(index, hexToRgb(event.currentTarget.value));
                customColors[index] = event.currentTarget.value;
                setCustomColors(customColors);
                if (isDiffBeastie) {
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
                  oldColors[beastiedata.id].custom[index] =
                    event.currentTarget.value;
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
            {L("beastiepedia.preview.color.reset")}
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
            {L("beastiepedia.preview.color.random")}
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
            {L("beastiepedia.preview.color.copyLink")}
          </button>
        </div>
        <label className={styles.taboffset}>
          {L("beastiepedia.preview.color.rowdyLabel")}
          <input
            type="checkbox"
            onChange={(event) => props.setRowdy(event.currentTarget.checked)}
            checked={props.rowdy}
          />
        </label>
        <div className={styles.taboffset}>
          {L("beastiepedia.preview.color.paletteSwapLabel")}
          <BeastieSelect
            beastieId={isDiffBeastie ? diffBeastieColors : undefined}
            setBeastieId={(beastieId: undefined | string) =>
              setDiffBeastieColors(beastieId ? beastieId : "none")
            }
            isSelectable={(beastie) => beastie.id != props.beastiedata.id}
            nonSelectableReason={L(
              "beastiepedia.preview.color.paletteSwapModalCurrentBeastie",
            )}
          />
        </div>
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
  isDiffBeastie: boolean;
  storedColors: StoredType;
  setStoredColors: React.Dispatch<React.SetStateAction<StoredType>>;
  colorChange: (change_index: number, color: number[]) => void;
  linkedColors: Record<string, number>;
}) {
  const { L } = useLocalization();

  const current = props.tab == props.currentTab;

  const colorValues = useRef(props.colorMax.map(() => 0.5));

  const lastValue = useRef([false, "", ""]);
  const currentValue = [current, props.beastieid, props.isDiffBeastie];
  const changed = lastValue.current.some(
    (value, index) => value == currentValue[index],
  );
  lastValue.current = currentValue;

  const {
    tab,
    colorChange,
    isDiffBeastie,
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
    if (!isDiffBeastie) {
      if (storedColors[beastieid] && !Array.isArray(storedColors[beastieid])) {
        colorValues.current = storedColors[beastieid][tab];
        if (colorValues.current.length < colorMax.length) {
          colorValues.current = colorMax.map(
            (index) => colorValues.current?.[index] ?? 0.5,
          );
        }
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
            : fallbackColors[index % fallbackColors.length].array,
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
    isDiffBeastie,
    fallbackColors,
    storedColors,
    colorChange,
  ]);

  let linkedColors: Record<number, number> = {};
  colorMax.forEach((index) => {
    if (props.linkedColors[`_${index}`] != undefined) {
      if (linkedColors[props.linkedColors[`_${index}`]] != undefined) {
        linkedColors = {};
      } else {
        linkedColors[props.linkedColors[`_${index}`]] = index;
        linkedColors[index] = props.linkedColors[`_${index}`];
      }
    }
  });

  const setColors = (colors: number[]) => {
    colorValues.current = colors.map((col, index) =>
      linkedColors[index] == undefined || linkedColors[index] > index
        ? col
        : colors[linkedColors[index]],
    );
    colorValues.current.forEach((col, index) => {
      colorChange(
        index,
        getColorInBeastieColors(
          col,
          index < props.colors.length
            ? props.colors[index].array
            : props.fallbackColors[index % props.fallbackColors.length].array,
        ),
      );
    });
    if (!isDiffBeastie) {
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

  const changeColor = (
    index: number,
    newColor: number,
    linkedColor: boolean = false,
  ) => {
    props.colorChange(
      index,
      getColorInBeastieColors(
        newColor,
        index < props.colors.length
          ? props.colors[index].array
          : props.fallbackColors[index % props.fallbackColors.length].array,
      ),
    );
    colorValues.current[index] = newColor;
    if (!isDiffBeastie) {
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
    if (!linkedColor && linkedColors[index] != undefined) {
      changeColor(linkedColors[index], newColor, true);
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
                : props.fallbackColors[value % props.fallbackColors.length]
                    .array
            }
            value={colorValues.current[value]}
            handleColorChange={(newColor) => changeColor(value, newColor)}
          />
        ) : null,
      )}
      <button onClick={() => setColors(colorMax.map(() => 0.5))}>
        {L("beastiepedia.preview.color.reset")}
      </button>
      <button onClick={() => setColors(colorMax.map(() => Math.random()))}>
        {L("beastiepedia.preview.color.random")}
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
        {L("beastiepedia.preview.color.copyLink")}
      </button>
    </div>
  );
}
