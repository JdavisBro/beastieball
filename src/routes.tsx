import { lazy } from "react";
import { useRouteError, type RouteObject } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const Beastiepedia = lazy(() => import("./Beastiepedia/Beastiepedia"));
const Playdex = lazy(() => import("./Playdex/Playdex"));
const Map = lazy(() => import("./Map/Map"));
const Modding = lazy(() => import("./Modding/Modding"));
const Save = lazy(() => import("./Modding/Save/Save"));
const Test = lazy(() => import("./Test"));

const UPDATED_ERRORS = ["unable to preload css", "dynamically imported module"];

function RouteError() {
  const error = useRouteError();

  const errorLower = String(error).toLowerCase();

  console.log(sessionStorage.getItem("reloadAttempted"));
  if (
    !location.href.endsWith("#") &&
    UPDATED_ERRORS.some((text) => errorLower.includes(text))
  ) {
    location.href = location.href + "#";
    location.reload();

    return (
      <div className="commoncontainer">
        <h2>Page Updated. Reloading.</h2>
      </div>
    );
  }

  return (
    <div className="commoncontainer">
      <h2>{String(error)}</h2>
    </div>
  );
}

const routes: Array<RouteObject> = [
  {
    path: "/",
    errorElement: <RouteError />,
    children: [
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
    ],
  },
];
export { routes };
