import { createContext, useContext } from "react";
import { LevelData } from "./types";
import { LevelStump } from "../../data/WorldData";

export enum EditorViewMode {
  Visible,
  Collision,
  All,
}

export type LevelEditorContextType = {
  viewMode: EditorViewMode;
  levelData: LevelData;
  levelStump: LevelStump;
  palette: number[];
};

export const LevelEditorContext = createContext<LevelEditorContextType>(
  {} as LevelEditorContextType,
);

export default function useLevelEditor() {
  return useContext(LevelEditorContext);
}
