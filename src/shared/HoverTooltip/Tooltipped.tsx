import React, { useContext } from "react";

import styles from "./HoverTooltip.module.css";
import { HoverTooltipContext } from "./HoverTooltipContext";
import { useLocalStorage } from "usehooks-ts";

export default function Tooltipped({
  children,
  tooltipId,
}: {
  children: React.ReactNode;
  tooltipId: string;
}) {
  const hoverTooltipContext = useContext(HoverTooltipContext);

  const [tooltipsEnabled] = useLocalStorage("tooltipsEnabled", true);
  const [tooltipsOnHover] = useLocalStorage("tooltipsOnHover", true);
  if (!tooltipsEnabled) {
    return children;
  }

  return (
    <span
      className={styles.tooltipped}
      onMouseOver={
        tooltipsOnHover
          ? (event) => {
              hoverTooltipContext?.open(tooltipId, [
                event.clientX,
                event.clientY,
              ]);
            }
          : undefined
      }
      onMouseMove={
        tooltipsOnHover
          ? (event) => {
              hoverTooltipContext?.move(tooltipId, [
                event.clientX,
                event.clientY,
              ]);
            }
          : undefined
      }
      onMouseLeave={
        tooltipsOnHover
          ? () => {
              hoverTooltipContext?.close(tooltipId);
            }
          : undefined
      }
      onClick={(event) => {
        hoverTooltipContext?.open(
          tooltipId,
          [event.clientX, event.clientY],
          true,
        );
        event.stopPropagation();
      }}
    >
      {children}
    </span>
  );
}
