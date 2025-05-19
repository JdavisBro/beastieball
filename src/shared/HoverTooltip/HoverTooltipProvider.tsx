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
  const tooltipOpenRef = useRef(tooltipOpen);
  tooltipOpenRef.current = tooltipOpen;
  const [tooltipPosition, setTooltipPosition] = useState<[number, number]>([
    0, 0,
  ]);
  const [tooltipStatic, setTooltipStatic] = useState(false);
  const tooltipStaticRef = useRef(tooltipStatic);
  tooltipStaticRef.current = tooltipStatic;
  const [tooltipCurrentId, setTooltipCurrentId] = useState<string>();
  const tooltipCurrentIdRef = useRef(tooltipCurrentId);
  tooltipCurrentIdRef.current = tooltipCurrentId;
  const [tooltipPath, setTooltipPath] = useState<string[]>([]);
  const tooltipPrevious = tooltipPath.length
    ? HOVER_TOOLTIPS[tooltipPath[tooltipPath.length - 1]]
    : undefined;

  const returnFocusRef = useRef<HTMLElement | undefined>(undefined);

  const modalOpen = !!document.querySelector("dialog:open");

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltipStatic && popoverRef.current) {
      popoverRef.current.focus();
    }
  }, [tooltipStatic, tooltipCurrentId]);

  useEffect(() => {
    const callback = () => {
      setTooltipOpen(false);
      setTooltipStatic(false);
      if (popoverRef.current) {
        popoverRef.current.hidePopover();
      }
      setTooltipPath([]);
      if (returnFocusRef.current) {
        returnFocusRef.current.focus();
        returnFocusRef.current = undefined;
      }
    };
    const keyboardCallback = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        callback();
      }
    };
    document.addEventListener("click", callback);
    document.addEventListener("touchmove", callback);
    document.addEventListener("scroll", callback, true);
    document.addEventListener("keydown", keyboardCallback, true);
    return () => {
      document.removeEventListener("click", callback);
      document.removeEventListener("touchmove", callback);
      document.removeEventListener("scroll", callback, true);
      document.removeEventListener("keydown", keyboardCallback, true);
    };
  }, []);

  const hoverTooltipInfo = tooltipCurrentId && HOVER_TOOLTIPS[tooltipCurrentId];

  const contextValue: HoverTooltipType = useMemo(
    () => ({
      open: (tooltipId, at, return_focus, is_static, select) => {
        if (tooltipStaticRef.current && !is_static) {
          return;
        }
        if (popoverRef.current) {
          popoverRef.current.showPopover();
          if (is_static) {
            const modal = document.querySelector("dialog:open");
            if (modal) {
              (modal as HTMLDialogElement).close();
            }
          }
        }
        if (return_focus) {
          returnFocusRef.current = return_focus;
        }
        setTooltipCurrentId(tooltipId);
        setTooltipOpen(true);
        if (at) {
          if (!select || !tooltipOpenRef.current) {
            setTooltipPosition(at);
            setTooltipPath([]);
          }
        } else {
          const currentTooltip = tooltipCurrentIdRef.current;
          setTooltipPath((oldPath) => {
            const index = oldPath.indexOf(tooltipId);
            if (index != -1) {
              return oldPath.slice(0, index);
            } else if (currentTooltip) {
              return [...oldPath, currentTooltip];
            }
            return [];
          });
        }
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
          setTooltipPath([]);
          returnFocusRef.current = undefined;
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
        container={{
          className: tooltipsEnabled
            ? tooltipOpen
              ? tooltipStatic
                ? styles.tooltipStatic
                : styles.tooltipOpen
              : styles.tooltip
            : styles.tooltip,
          style: tooltipsEnabled
            ? ({
                "--hover-x": `${tooltipPosition[0] + 20}px`,
                "--hover-y": `${tooltipPosition[1]}px`,
              } as CSSProperties)
            : undefined,
          popover: "manual",
          tabIndex: 0,
          role: "dialog",
          id: "tooltip-content",
          onClick: (event) => event.stopPropagation(),
          onTouchMove: (event) => event.stopPropagation(),
          onScroll: (event) => event.stopPropagation(),
        }}
        containerRef={popoverRef}
      >
        {tooltipPrevious ? (
          <div
            className={styles.tooltipBackButton}
            onClick={() => {
              setTooltipCurrentId(tooltipPrevious.id);
              setTooltipPath(tooltipPath.slice(0, -1));
            }}
            onKeyDown={(event) => {
              if (event.key == "Enter") {
                setTooltipCurrentId(tooltipPrevious.id);
                setTooltipPath(tooltipPath.slice(0, -1));
              }
            }}
            tabIndex={0}
          >
            ← {tooltipPrevious.title}
          </div>
        ) : null}
        {tooltipStatic ? null : (
          <div className={styles.tooltipFreezeText}>
            (Click to Freeze{modalOpen ? " - Will Close Popup" : ""})
          </div>
        )}
        {tooltipOpen && hoverTooltipInfo ? (
          <TextTag autoTooltip={false} innerTooltip={true}>
            {hoverTooltipInfo.desc}
          </TextTag>
        ) : null}
      </InfoBox>
      {children}
    </HoverTooltipContext.Provider>
  );
}
