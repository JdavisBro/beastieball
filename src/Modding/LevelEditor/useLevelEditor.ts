import { createContext, useContext } from "react";

export enum EditorViewMode {
  Visible,
  Collision,
  All,
}

export type LevelEditorContextType = {
  viewMode: EditorViewMode;
};

export const LevelEditorContext = createContext<LevelEditorContextType>({
  viewMode: EditorViewMode.Visible,
});

export default function useLevelEditor() {
  return useContext(LevelEditorContext);
}
