import useBeastieRender from "./useBeastieRender";
import { RenderBeastieType } from "./BeastieRenderContext";
import BEASTIE_DATA from "../../data/BeastieData";

export function BeastieImage(props: {
  defaultUrl: string;
  beastie: RenderBeastieType;
}): React.ReactElement {
  const beastieUrl = useBeastieRender(props.defaultUrl, props.beastie);
  let alt = "";
  const beastie_data = BEASTIE_DATA.get(props.beastie.id);
  if (beastie_data) {
    alt = beastie_data.name;
  }

  return <img src={beastieUrl} alt={alt} />;
}
