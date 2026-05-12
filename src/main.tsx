import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { routes } from "./routes";
import { useLocalStorage } from "usehooks-ts";
import { HelmetProvider } from "react-helmet-async";
import CustomErrorBoundary from "./shared/CustomErrorBoundary";
import { ErrorBoundary } from "react-error-boundary";

const container = document.getElementById("root");

if (container == null) {
  throw new Error("App root container is missing");
}

function Container(props: { children: React.ReactNode }): React.ReactNode {
  const [noAnimations] = useLocalStorage("noAnimations", false, {
    serializer: String,
    deserializer: (value) => value == "true",
  });

  return (
    <div className={noAnimations ? "container noanim" : "container"}>
      <CustomErrorBoundary
        fallbackClassName={noAnimations ? "container noanim" : "container"}
      >
        {props.children}
      </CustomErrorBoundary>
    </div>
  );
}

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <Container>
        <ErrorBoundary fallback={<></>}>
          <RouterProvider router={createBrowserRouter(routes, {})} />
        </ErrorBoundary>
      </Container>
    </HelmetProvider>
  </StrictMode>,
);
