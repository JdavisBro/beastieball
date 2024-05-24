import React from "react";
import SaveData from "./SaveType";

export default function LoadedFile(props: {
  save: SaveData;
}): React.ReactElement {
  return <>{JSON.stringify(props.save)}</>;
}
