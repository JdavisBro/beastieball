/// <reference types="react/canary" />

import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./HoverTooltip.module.css";
import InfoBox from "../InfoBox";
import { HoverTooltipContext, HoverTooltipType } from "./HoverTooltipContext";
import TextTag from "../TextTag";
import { HOVER_TOOLTIPS } from "./hoverTooltips";
import { useLocalStorage } from "usehooks-ts";

export default function HoverTooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<[number, number]>([
    0, 0,
  ]);
  const [tooltipStatic, setTooltipStatic] = useState(false);
  const tooltipStaticRef = useRef(tooltipStatic);
  tooltipStaticRef.current = tooltipStatic;
  const [tooltipCurrentId, setTooltipCurrentId] = useState<string>();
  const tooltipCurrentIdRef = useRef(tooltipCurrentId);
  tooltipCurrentIdRef.current = tooltipCurrentId;

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callback = () => {
      setTooltipOpen(false);
      setTooltipStatic(false);
    };
    window.addEventListener("click", callback);
    window.addEventListener("touchmove", callback);
    return () => {
      window.removeEventListener("click", callback);
      window.removeEventListener("touchmove", callback);
    };
  }, []);

  const hoverTooltipInfo = tooltipCurrentId && HOVER_TOOLTIPS[tooltipCurrentId];

  const contextValue: HoverTooltipType = useMemo(
    () => ({
      open: (tooltipId, at, is_static) => {
        if (tooltipStaticRef.current && !is_static) {
          return;
        }
        console.log(popoverRef);
        if (popoverRef.current) {
          popoverRef.current.showPopover();
        }
        setTooltipCurrentId(tooltipId);
        setTooltipOpen(true);
        setTooltipPosition(at);
        setTooltipStatic(is_static ?? false);
      },
      close: (tooltipId) => {
        if (
          tooltipCurrentIdRef.current == tooltipId &&
          !tooltipStaticRef.current
        ) {
          setTooltipOpen(false);
          if (popoverRef.current) {
            popoverRef.current.hidePopover();
          }
        }
      },
      move: (tooltipId, to) => {
        if (
          tooltipCurrentIdRef.current == tooltipId &&
          !tooltipStaticRef.current
        ) {
          setTooltipPosition(to);
        }
      },
    }),
    [],
  );

  const [tooltipsEnabled] = useLocalStorage("tooltipsEnabled", true);

  return (
    <HoverTooltipContext.Provider
      value={tooltipsEnabled ? contextValue : undefined}
    >
      <InfoBox
        header={(hoverTooltipInfo && hoverTooltipInfo?.title) || "Tooltip"}
        className={
          tooltipsEnabled
            ? tooltipOpen
              ? tooltipStatic
                ? styles.tooltipStatic
                : styles.tooltipOpen
              : styles.tooltip
            : styles.tooltip
        }
        style={
          tooltipsEnabled
            ? ({
                "--hover-x": `${tooltipPosition[0] + 20}px`,
                "--hover-y": `${tooltipPosition[1]}px`,
              } as CSSProperties)
            : undefined
        }
        onClick={(event) => event.stopPropagation()}
        useRef={popoverRef}
        popover={"manual"}
      >
        {tooltipOpen && hoverTooltipInfo ? (
          <TextTag autoTooltip={false}>{hoverTooltipInfo.desc}</TextTag>
        ) : null}
      </InfoBox>
      {children}
    </HoverTooltipContext.Provider>
  );
}
