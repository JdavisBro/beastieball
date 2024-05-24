import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const Beastiepedia = lazy(() => import("./Beastiepedia/Beastiepedia"));
const Map = lazy(() => import("./Map/Map"));
const Modding = lazy(() => import("./Modding/Modding"));
const Save = lazy(() => import("./Modding/Save/Save"));

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
    element: <Save />,
    path: "/modding/save/",
  },
  {
    element: <Modding />,
    path: "/modding/",
  },
  {
    element: <PageNotFound />,
    path: "*",
  },
];
export { routes };
