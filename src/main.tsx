import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "./Loading";
import "./index.css";
import { routes } from "./routes";
import OpenGraph from "./shared/OpenGraph";
import { useLocalStorage } from "usehooks-ts";
import { HelmetProvider } from "react-helmet-async";

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
      {props.children}
    </div>
  );
}

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <OpenGraph
        title="Beastieball Info"
        image="ball.png"
        url=""
        description="A website with information on Beastieball!"
      />
      <Container>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={createBrowserRouter(routes)} />
        </Suspense>
      </Container>
    </HelmetProvider>
  </StrictMode>,
);
