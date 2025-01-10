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

  const colorChecksum = beastie.colors?.reduce(
    (prev, curr, index) => prev + curr * index * 4,
  );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    renderContext,
    beastie.colorAlt,
    beastie.frame,
    beastie.sprAlt,
    beastie.id,
    colorChecksum,
  ]);

  return beastieUrl;
}
