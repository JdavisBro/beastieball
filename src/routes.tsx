import { lazy } from "react";
import { useRouteError, type RouteObject } from "react-router-dom";
import PageNotFound from "./PageNotFound";

const Home = lazy(() => import("./Home"));
const Beastiepedia = lazy(() => import("./Beastiepedia/Beastiepedia"));
const Playdex = lazy(() => import("./Playdex/Playdex"));
const Map = lazy(() => import("./Map/Map"));
const Beastdle = lazy(() => import("./Beastdle/Beastdle"));
const Teams = lazy(() => import("./Teams/Teams"));
const Modding = lazy(() => import("./Modding/Modding"));
const Save = lazy(() => import("./Modding/Save/Save"));
const Test = lazy(() => import("./Test"));

const UPDATED_ERRORS = ["unable to preload css", "dynamically imported module"];

function RouteError() {
  const error = useRouteError();

  const errorLower = String(error).toLowerCase();
  const updatedError = UPDATED_ERRORS.some((text) => errorLower.includes(text));

  if (!location.href.endsWith("#") && updatedError) {
    location.href += "#";
    location.reload();
  }

  return (
    <div className="commoncontainer">
      <h2>
        {String(error)}
        {updatedError ? (
          <>
            <br />
            Page may have been updated. Attmepting to reload.
          </>
        ) : null}
      </h2>
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
        element: <Beastdle />,
        path: "/beastdle/",
      },
      {
        element: <Teams />,
        path: "/teams/",
      },
      {
        element: <Teams />,
        path: "/teams/:code",
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
