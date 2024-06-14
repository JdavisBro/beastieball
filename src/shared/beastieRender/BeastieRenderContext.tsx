import { createContext, useContext, useEffect, useState } from "react";

export type RenderBeastieType = {
  id: string;
  colors?: number[]; // defaults to 0.5 for all values
  frame?: number; // defaults to menu animation startframe
  colorAlt?: "colors" | "colors2" | "shiny";
};

export const BeastieRenderContext = createContext<null | {
  render: (beastie: RenderBeastieType) => {
    id: number;
    url: Promise<string | null>;
  };
  cancel: (id: number) => void;
}>(null);

export default function useBeastieRender(
  defaultUrl: string,
  beastie: RenderBeastieType,
): string {
  const [beastieUrl, setBeastieUrl] = useState(defaultUrl);
  const renderContext = useContext(BeastieRenderContext);

  useEffect(() => {
    if (!renderContext) {
      return;
    }
    const { id, url } = renderContext.render(beastie);
    url.then((value) => {
      if (value) {
        setBeastieUrl(value);
      }
    });
    return () => renderContext.cancel(id);
  }, [renderContext, beastie]);

  return beastieUrl;
}

export function BeastieImage(props: {
  defaultUrl: string;
  beastie: RenderBeastieType;
}): React.ReactElement {
  const beastieUrl = useBeastieRender(props.defaultUrl, props.beastie);
  return <img src={beastieUrl} />;
}
