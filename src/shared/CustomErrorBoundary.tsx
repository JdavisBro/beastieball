import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";
import useLocalization from "../localization/useLocalization";

export function Fallback({
  error,
  resetErrorBoundary,
  className,
}: {
  className: string;
  error: Error;
  resetErrorBoundary?: () => void;
}) {
  const { L, anyLanguageLoaded } = useLocalization();

  const filename = "fileName" in error ? error.fileName : "";
  const lineNumber = "lineNumber" in error ? error.lineNumber : "";

  console.log(error);
  return (
    <div className={className}>
      <h1>{anyLanguageLoaded ? L("error.title") : "Error!"}</h1>
      <img src="/nojs.png" />
      <button onClick={resetErrorBoundary}>
        {anyLanguageLoaded ? L("error.reset") : "Reset"}
      </button>
      <Link
        to={`https://github.com/JdavisBro/beastieball/issues/new?body=Describe%20what%20happened%20before%20the%20error:%20%0A%0A${String(error)}%0A${filename}:${lineNumber}%0A%0A${error.stack}`}
        target="_blank"
      >
        {anyLanguageLoaded ? L("error.github") : "Report on GitHub Issues"}
      </Link>
      <br />
      <p>{String(error)}</p>
      <br />
      <pre style={{ maxHeight: "50%", overflowY: "scroll" }}>{error.stack}</pre>
    </div>
  );
}

export default function CustomErrorBoundary(
  props: PropsWithChildren<{
    fallbackClassName: string;
  }>,
) {
  return (
    <ErrorBoundary
      fallbackRender={(fallbackprops) => (
        <Fallback
          className={props.fallbackClassName}
          error={fallbackprops.error as Error}
          resetErrorBoundary={fallbackprops.resetErrorBoundary}
        />
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}
