import { ErrorInfo, PropsWithChildren } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";

export function Fallback({
  error,
  resetErrorBoundary,
  className,
}: Omit<FallbackProps, "resetErrorBoundary"> & {
  className: string;
  resetErrorBoundary?: () => void;
}) {
  console.log(error);
  return (
    <div className={className}>
      <h1>Error!</h1>
      <img src="/nojs.png" />
      <button onClick={resetErrorBoundary}>Reset</button>
      <Link
        to={`https://github.com/JdavisBro/beastieball/issues/new?body=Describe%20what%20happened%20before%20the%20error:%20%0A%0A${String(error)}%0A${error.fileName}:${error.lineNumber}%0A%0A${error.stack}`}
        target="_blank"
      >
        Report on GitHub Issues
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
