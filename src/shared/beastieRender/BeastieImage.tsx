import useBeastieRender from "./useBeastieRender";
import { RenderBeastieType } from "./BeastieRenderContext";
import BEASTIE_DATA from "../../data/BeastieData";
import useLocalization from "../../localization/useLocalization";

export function BeastieImage(props: {
  defaultUrl: string;
  beastie: RenderBeastieType;
  alt?: string;
  className?: string;
  loadingClassName?: string;
}): React.ReactElement {
  const { L } = useLocalization();

  const beastieUrl = useBeastieRender(props.defaultUrl, props.beastie);
  let alt = props.alt;
  if (props.alt == undefined) {
    const beastie_data = BEASTIE_DATA.get(props.beastie.id);
    if (beastie_data) alt = L(beastie_data.name);
  }
  const className =
    props.defaultUrl == beastieUrl && props.loadingClassName
      ? props.loadingClassName
      : props.className;

  return <img src={beastieUrl} alt={alt} className={className} />;
}
