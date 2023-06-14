// @flow strict

import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("./home/Home"));
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

export { routes };
