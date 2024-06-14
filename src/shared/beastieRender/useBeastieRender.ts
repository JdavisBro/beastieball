import { useContext, useEffect, useState } from "react";
import {
  BeastieRenderContext,
  RenderBeastieType,
} from "./BeastieRenderContext";

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
