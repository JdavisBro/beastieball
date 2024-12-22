import { useContext, useRef, useState } from "react";
import { TeamBeastie } from "./Types";
import { createTeamImageCanvas, DrawMode } from "./TeamImage";
import { BeastieRenderContext } from "../shared/beastieRender/BeastieRenderContext";

export default function TeamImageButton({
  team,
  atLevel,
  maxCoaching,
}: {
  team?: TeamBeastie[];
  atLevel?: number;
  maxCoaching?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beastieRender = useContext(BeastieRenderContext);

  const [mode, setMode] = useState(DrawMode.VGrid);

  const saveImage = (copy: boolean) => {
    if (team && canvasRef.current && beastieRender)
      createTeamImageCanvas(
        canvasRef.current,
        team,
        mode,
        beastieRender.renderQuick,
        atLevel,
        maxCoaching,
        copy,
      );
  };

  return (
    <>
      Image:{" "}
      <select onChange={(event) => setMode(Number(event.currentTarget.value))}>
        <option value={DrawMode.VGrid}>Grid</option>
        <option value={DrawMode.Horizontal}>Horizontal</option>
        <option value={DrawMode.Vertical}>Vertical</option>
      </select>
      <button disabled={!team} onClick={() => saveImage(false)}>
        Save
      </button>
      <button disabled={!team} onClick={() => saveImage(true)}>
        Copy
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
