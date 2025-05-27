import {
  Navigate,
  Outlet,
  useLoaderData,
  useParams,
  useRouteError,
  type RouteObject,
} from "react-router-dom";
import PageNotFound from "./PageNotFound";
import LocalizationProvider from "./localization/LocalizationProvider";
import SpoilerWarning from "./SpoilerWarning";
import useLocalization from "./localization/useLocalization";
import { FunctionComponent, memo, useMemo } from "react";

function LoaderComponent() {
  const loader =
    useLoaderData() as React.MemoExoticComponent<FunctionComponent>;

  const Component = useMemo(() => memo(loader), [loader]);

  return <Component />;
}

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
        <SpoilerWarning>
          <Outlet />
        </SpoilerWarning>
      </LocalizationProvider>
    ),
    errorElement: <RouteError />,
    children: [
      {
        element: <LoaderComponent />,
        path: "",
        loader: () => import("./Home").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "beastiepedia/",
        loader: () =>
          import("./Beastiepedia/Beastiepedia").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "beastiepedia/:beastie",
        loader: () =>
          import("./Beastiepedia/Beastiepedia").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "playdex/",
        loader: () => import("./Playdex/Playdex").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "map/",
        loader: () => import("./Map/Map").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "beastdle/",
        loader: () => import("./Beastdle/Beastdle").then((m) => m.default),
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
        element: <LoaderComponent />,
        path: "team/",
        loader: () => import("./Team/Team").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "team/viewer/:code",
        loader: () => import("./Team/Viewer/TeamViewer").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "team/viewer/",
        loader: () => import("./Team/Viewer/TeamViewer").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "team/builder/",
        loader: () =>
          import("./Team/Builder/TeamBuilder").then((m) => m.default),
      },

      {
        element: <LoaderComponent />,
        path: "modding/save/",
        loader: () => import("./Modding/Save/Save").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "modding/",
        loader: () => import("./Modding/Modding").then((m) => m.default),
      },
      {
        element: <LoaderComponent />,
        path: "test/",
        loader: () => import("./Test").then((m) => m.default),
      },
      {
        element: <PageNotFound />,
        path: "*",
      },
    ],
  },
];
export { routes };
