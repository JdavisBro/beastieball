// @flow strict

import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "./Loading";
import { routes } from "./routes";

// eslint-disable-next-line no-undef
const container = document.getElementById("root");
if (container == null) {
  throw new Error("App root container is missing");
}

// https://reactcommunity.org/react-modal/accessibility/#app-element

createRoot(container).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </Suspense>
  </StrictMode>
);
