import { createContext } from "react";

export type RenderBeastieType = {
  id: string;
  colors?: number[]; // defaults to 0.5 for all values
  frame?: number; // defaults to menu animation startframe
  colorAlt?: "colors" | "colors2" | "shiny";
  sprAlt?: number;
};

export const BeastieRenderContext = createContext<null | {
  render: (beastie: RenderBeastieType) => {
    id: number;
    url: Promise<string | null>;
  };
  cancel: (id: number) => void;
}>(null);
