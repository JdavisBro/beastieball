import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const Beastiepedia = lazy(() => import("./Beastiepedia/Beastiepedia"));
const Playdex = lazy(() => import("./Playdex/Playdex"));
const Map = lazy(() => import("./Map/Map"));
const Modding = lazy(() => import("./Modding/Modding"));
const Save = lazy(() => import("./Modding/Save/Save"));
const Test = lazy(() => import("./Test"));

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
    element: <Playdex />,
    path: "/playdex/",
  },
  {
    element: <Playdex />,
    path: "playdex/:move",
  },
  {
    element: <Map />,
    path: "/map/",
  },
  {
    element: <Save />,
    path: "/modding/save/",
  },
  {
    element: <Modding />,
    path: "/modding/",
  },
  {
    element: <Test />,
    path: "/test/",
  },
  {
    element: <PageNotFound />,
    path: "*",
  },
];
export { routes };
