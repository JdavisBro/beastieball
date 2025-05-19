import { createContext } from "react";

export type HoverTooltipType = {
  open: (
    tooltipId: string,
    at?: [number, number],
    return_focus?: HTMLElement,
    is_static?: boolean,
    select?: boolean,
  ) => void;
  close: (tooltipId?: string) => void;
  move: (tooltipId: string, to: [number, number]) => void;
};

export const HoverTooltipContext = createContext<HoverTooltipType | undefined>(
  undefined,
);
