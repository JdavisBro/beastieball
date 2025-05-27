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

function LoaderComponent() {
  const Component = (useLoaderData() as { default: React.FunctionComponent })
    .default;
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
        loader: () => import("./Home"),
      },
      {
        element: <LoaderComponent />,
        path: "beastiepedia/",
        loader: () => import("./Beastiepedia/Beastiepedia"),
      },
      {
        element: <LoaderComponent />,
        path: "beastiepedia/:beastie",
        loader: () => import("./Beastiepedia/Beastiepedia"),
      },
      {
        element: <LoaderComponent />,
        path: "playdex/",
        loader: () => import("./Playdex/Playdex"),
      },
      {
        element: <LoaderComponent />,
        path: "map/",
        loader: () => import("./Map/Map"),
      },
      {
        element: <LoaderComponent />,
        path: "beastdle/",
        loader: () => import("./Beastdle/Beastdle"),
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
        loader: () => import("./Team/Team"),
      },
      {
        element: <LoaderComponent />,
        path: "team/viewer/:code",
        loader: () => import("./Team/Viewer/TeamViewer"),
      },
      {
        element: <LoaderComponent />,
        path: "team/viewer/",
        loader: () => import("./Team/Viewer/TeamViewer"),
      },
      {
        element: <LoaderComponent />,
        path: "team/builder/",
        loader: () => import("./Team/Builder/TeamBuilder"),
      },

      {
        element: <LoaderComponent />,
        path: "modding/save/",
        loader: () => import("./Modding/Save/Save"),
      },
      {
        element: <LoaderComponent />,
        path: "modding/",
        loader: () => import("./Modding/Modding"),
      },
      {
        element: <LoaderComponent />,
        path: "test/",
        loader: () => import("./Test"),
      },
      {
        element: <PageNotFound />,
        path: "*",
      },
    ],
  },
];
export { routes };
