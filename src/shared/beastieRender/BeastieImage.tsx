import useBeastieRender from "./useBeastieRender";
import { RenderBeastieType } from "./BeastieRenderContext";
import BEASTIE_DATA from "../../data/BeastieData";
import useLocalization from "../../localization/useLocalization";

export function BeastieImage(props: {
  defaultUrl: string;
  beastie: RenderBeastieType;
  className?: string;
}): React.ReactElement {
  const { L } = useLocalization();

  const beastieUrl = useBeastieRender(props.defaultUrl, props.beastie);
  let alt = "";
  const beastie_data = BEASTIE_DATA.get(props.beastie.id);
  if (beastie_data) {
    alt = L(beastie_data.name);
  }

  return <img src={beastieUrl} alt={alt} className={props.className} />;
}
