import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "./Loading";
import "./index.css";
import { routes } from "./routes";
import { Helmet } from "react-helmet";

const container = document.getElementById("root");

if (container == null) {
  throw new Error("App root container is missing");
}

createRoot(container).render(
  <StrictMode>
    <Helmet>
      <title>Beastieball Info</title>
      <meta property="og:title" content="Beastieball Info" />
      <meta
        property="og:image"
        content={`${import.meta.env.VITE_NETLIFY_URL}/ball.png`}
      />
      <meta property="og:url" content={import.meta.env.VITE_NETLIFY_URL} />
      <meta
        property="og:description"
        content="A website with data on Beastieball!"
      />
      <meta property="og:type" content="website" />
    </Helmet>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </Suspense>
  </StrictMode>
);
