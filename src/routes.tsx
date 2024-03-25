import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("./Home/Home"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const Beastiepedia = lazy(() => import("./Beastiepedia/Beastiepedia"));
const Map = lazy(() => import("./Map/Map"));

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
    element: <Map />,
    path: "/map/",
  },
  {
    element: <PageNotFound />,
    path: "*",
  },
];
export { routes };
