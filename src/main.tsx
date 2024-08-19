import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "./Loading";
import "./index.css";
import { routes } from "./routes";
import OpenGraph from "./shared/OpenGraph";
import { useLocalStorage } from "usehooks-ts";
import { HelmetProvider } from "react-helmet-async";
import SpoilerWarning from "./SpoilerWarning";
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

  useEffect(() => {
    sessionStorage.removeItem("reloadAttempted");
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
      <OpenGraph
        title={import.meta.env.VITE_BRANDING}
        image="ball.png"
        url=""
        description="A website with information on Beastieball!"
      />
      <Container>
        <SpoilerWarning>
          <Suspense fallback={<Loading />}>
            <ErrorBoundary fallback={<></>}>
              <RouterProvider router={createBrowserRouter(routes, {})} />
            </ErrorBoundary>
          </Suspense>
        </SpoilerWarning>
      </Container>
    </HelmetProvider>
  </StrictMode>,
);
