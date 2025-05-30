import { ErrorInfo, PropsWithChildren } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";
import useLocalization from "../localization/useLocalization";

function Fallback({
  error,
  resetErrorBoundary,
  className,
}: FallbackProps & { className: string }) {
  const { L } = useLocalization();

  console.log(error);
  return (
    <div className={className}>
      <h1>{L("error.title")}</h1>
      <button onClick={resetErrorBoundary}>{L("error.reset")}</button>
      <button
        onClick={() =>
          navigator.clipboard.writeText(
            `${String(error)}\n${error.fileName}:${error.lineNumber}\n\n${error.stack}`,
          )
        }
      >
        {L("error.copy")}
      </button>
      <Link
        to="https://github.com/JdavisBro/beastieball/issues"
        target="_blank"
      >
        {L("error.github")}
      </Link>
      <br />
      <p>{String(error)}</p>
      <br />
      <pre>{error.stack}</pre>
    </div>
  );
}

export default function CustomErrorBoundary(
  props: PropsWithChildren<{
    onError?: (error: Error, info: ErrorInfo) => void;
    fallbackClassName: string;
  }>,
) {
  return (
    <ErrorBoundary
      fallbackRender={(fallbackprops) => (
        <Fallback className={props.fallbackClassName} {...fallbackprops} />
      )}
      {...props}
    >
      {props.children}
    </ErrorBoundary>
  );
}
