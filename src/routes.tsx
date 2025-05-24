import { lazy } from "react";
import {
  Navigate,
  useParams,
  useRouteError,
  type RouteObject,
} from "react-router-dom";
import PageNotFound from "./PageNotFound";
import LocalizationProvider from "./localization/LocalizationProvider";
import SpoilerWarning from "./SpoilerWarning";
import useLocalization from "./localization/useLocalization";

const Home = lazy(() => import("./Home"));
const Beastiepedia = lazy(() => import("./Beastiepedia/Beastiepedia"));
const Playdex = lazy(() => import("./Playdex/Playdex"));
const Map = lazy(() => import("./Map/Map"));
const Beastdle = lazy(() => import("./Beastdle/Beastdle"));
const Team = lazy(() => import("./Team/Team"));
const TeamViewer = lazy(() => import("./Team/Viewer/TeamViewer"));
const TeamBuilder = lazy(() => import("./Team/Builder/TeamBuilder"));
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

function NavigateLocalized({ to }: { to: string }) {
  const { getLink } = useLocalization();
  return <Navigate to={getLink(to)} />;
}

const routes: Array<RouteObject> = [
  {
    path: ":lang?/",
    element: (
      <LocalizationProvider>
        <SpoilerWarning />
      </LocalizationProvider>
    ),
    errorElement: <RouteError />,
    children: [
      {
        element: <Home />,
        path: "",
      },
      {
        element: <Beastiepedia />,
        path: "beastiepedia/",
      },
      {
        element: <Beastiepedia />,
        path: "beastiepedia/:beastie",
      },
      {
        element: <Playdex />,
        path: "playdex/",
      },
      {
        element: <Map />,
        path: "map/",
      },
      {
        element: <Beastdle />,
        path: "beastdle/",
      },

      // OLD TEAM VIEWER REDIRECT
      {
        element: <NavigateLocalized to="/team/viewer/" />,
        path: "teams/",
      },
      {
        element: <NavigateLocalized to="/team/viewer/" />,
        path: "teams/viewer/",
      },
      {
        Component: () => (
          <NavigateLocalized to={`/team/viewer/${useParams().code}`} />
        ),
        path: "teams/:code",
      },
      {
        element: <NavigateLocalized to="/team/builder/" />,
        path: "teams/builder/",
      },

      {
        element: <Team />,
        path: "team/",
      },
      {
        element: <TeamViewer />,
        path: "team/viewer/:code",
      },
      {
        element: <TeamViewer />,
        path: "team/viewer/",
      },
      {
        element: <TeamBuilder />,
        path: "team/builder/",
      },

      {
        element: <Save />,
        path: "modding/save/",
      },
      {
        element: <Modding />,
        path: "modding/",
      },
      {
        element: <Test />,
        path: "test/",
      },
      {
        element: <PageNotFound />,
        path: "*",
      },
    ],
  },
];
export { routes };
