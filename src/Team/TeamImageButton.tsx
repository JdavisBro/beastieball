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
    if (team && team.length && canvasRef.current)
      createTeamImageCanvas(
        canvasRef.current,
        team,
        mode,
        beastieRender ? beastieRender.renderQuick : undefined,
        atLevel,
        maxCoaching,
        copy,
      );
  };

  const buttonsDisabled = !team || !team.length;

  return (
    <span>
      <label>
        Image:{" "}
        <select
          onChange={(event) => setMode(Number(event.currentTarget.value))}
        >
          <option value={DrawMode.VGrid}>Grid</option>
          <option value={DrawMode.Horizontal}>Horizontal</option>
          <option value={DrawMode.Vertical}>Vertical</option>
        </select>
      </label>
      <button disabled={buttonsDisabled} onClick={() => saveImage(false)}>
        Save
      </button>
      <button disabled={buttonsDisabled} onClick={() => saveImage(true)}>
        Copy
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </span>
  );
}
