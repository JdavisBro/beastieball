import { useContext, useRef, useState } from "react";
import { TeamBeastie } from "./Types";
import { createTeamImageCanvas, DrawMode } from "./TeamImage";
import { BeastieRenderContext } from "../shared/beastieRender/BeastieRenderContext";
import useLocalization from "../localization/useLocalization";

export default function TeamImageButton({
  team,
  atLevel,
  maxCoaching,
}: {
  team?: TeamBeastie[];
  atLevel?: number;
  maxCoaching?: boolean;
}) {
  const Localization = useLocalization();
  const { L } = Localization;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beastieRender = useContext(BeastieRenderContext);

  const [mode, setMode] = useState(DrawMode.VGrid);

  const saveImage = (copy: boolean) => {
    if (team && canvasRef.current && beastieRender)
      createTeamImageCanvas(
        canvasRef.current,
        team,
        mode,
        Localization,
        beastieRender.renderQuick,
        atLevel,
        maxCoaching,
        copy,
      );
  };

  return (
    <span>
      <label>
        {L("teams.image.imageLabel")}
        <select
          onChange={(event) => setMode(Number(event.currentTarget.value))}
        >
          <option value={DrawMode.VGrid}>
            {L("teams.image.drawMode.grid")}
          </option>
          <option value={DrawMode.Horizontal}>
            {L("teams.image.drawMode.horizontal")}
          </option>
          <option value={DrawMode.Vertical}>
            {L("teams.image.drawMode.vertical")}
          </option>
        </select>
      </label>
      <button disabled={!team} onClick={() => saveImage(false)}>
        {L("teams.image.save")}
      </button>
      <button disabled={!team} onClick={() => saveImage(true)}>
        {L("teams.image.copy")}
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </span>
  );
}
