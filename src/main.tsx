import {StrictMode, Suspense} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Loading from "./Loading";
import {routes} from "./routes";

const container = document.getElementById("root");

if (container == null) {
    throw new Error("App root container is missing");
}

createRoot(container).render(
    <StrictMode>
        <Suspense fallback={<Loading />}>
            <RouterProvider router={createBrowserRouter(routes)} />
        </Suspense>
    </StrictMode>,
);