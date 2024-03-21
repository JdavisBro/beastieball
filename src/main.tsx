import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "./Loading";
import "./index.css";
import { routes } from "./routes";
import OpenGraph from "./shared/OpenGraph";

const container = document.getElementById("root");

if (container == null) {
  throw new Error("App root container is missing");
}

createRoot(container).render(
  <StrictMode>
    <OpenGraph
      title="Beastieball Info"
      image="ball.png"
      url=""
      description="A website with data on Beastieball!"
    />
    <Suspense fallback={<Loading />}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </Suspense>
  </StrictMode>,
);
