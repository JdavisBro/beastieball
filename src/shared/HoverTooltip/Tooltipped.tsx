import React, { useContext } from "react";

import styles from "./HoverTooltip.module.css";
import { HoverTooltipContext } from "./HoverTooltipContext";
import { useLocalStorage } from "usehooks-ts";

export default function Tooltipped({
  children,
  tooltipId,
  innerTooltip,
}: {
  children: React.ReactNode;
  tooltipId: string;
  innerTooltip?: boolean;
}) {
  const hoverTooltipContext = useContext(HoverTooltipContext);

  const [tooltipsEnabled] = useLocalStorage("tooltipsEnabled", true);
  const [tooltipsOnHover] = useLocalStorage("tooltipsOnHover", true);
  if (!tooltipsEnabled) {
    return children;
  }
  const allowHover = !innerTooltip && tooltipsOnHover;

  return (
    <span
      className={styles.tooltipped}
      onMouseOver={
        allowHover
          ? (event) => {
              hoverTooltipContext?.open(tooltipId, [
                event.clientX,
                event.clientY,
              ]);
            }
          : undefined
      }
      onMouseMove={
        allowHover
          ? (event) => {
              hoverTooltipContext?.move(tooltipId, [
                event.clientX,
                event.clientY,
              ]);
            }
          : undefined
      }
      onMouseLeave={
        allowHover
          ? () => {
              hoverTooltipContext?.close(tooltipId);
            }
          : undefined
      }
      onClick={(event) => {
        hoverTooltipContext?.open(
          tooltipId,
          innerTooltip ? undefined : [event.clientX, event.clientY],
          true,
        );
        event.stopPropagation();
      }}
    >
      {children}
    </span>
  );
}
