/* eslint-disable react-refresh/only-export-components */
import {lazy} from "react";
import type {RouteObject} from "react-router-dom";

// eslint
const Home = lazy(() => import("./Home/Home"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const Beastiepedia = lazy(() => import("./Beastiepedia/Beastiepedia"));

const routes: Array<RouteObject> = [
    {
        element: <Home />,
        path: "/",
    },
    {
        element: <Beastiepedia />,
        path: "/beastiepedia/",
    },
    {
        element: <Beastiepedia />,
        path: "beastiepedia/:beastie",
    },
    {
        element: <PageNotFound />,
        path: "*",
    },
];
export {routes};