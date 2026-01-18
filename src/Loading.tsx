import { useEffect, useState } from "react";
import useLocalization from "./localization/useLocalization";

const MAX_DOTS = 3;

export default function Loading(): React.ReactElement {
  const { L, anyLanguageLoaded } = useLocalization();

  const [dots, setDots] = useState(0);

  const text = anyLanguageLoaded ? L("common.loadingNoDot") : "Loading";
  const dot = anyLanguageLoaded ? L("common.loadingDot") : ".";

  useEffect(() => {
    const timeout = setTimeout(
      () => setDots((value) => (value + 1) % (MAX_DOTS + 1)),
      1000,
    );
    return () => clearTimeout(timeout);
  });

  return (
    <div className="container">
      <div className="commoncontainer">
        <div className="loading animSelectableBackground">
          {text}
          {dot.repeat(dots)}
          <span className="notvisible">{dot.repeat(MAX_DOTS - dots)}</span>
        </div>
      </div>
    </div>
  );
}
