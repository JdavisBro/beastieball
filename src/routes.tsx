import {
  Navigate,
  Outlet,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteError,
  type RouteObject,
} from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { Fallback } from "./shared/CustomErrorBoundary";
import SpoilerWarning from "./SpoilerWarning";
import {
  FunctionComponent,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loading from "./Loading";

const LOADING_TIME = 20; // ms

function Root() {
  const navigation = useNavigation();
  const [, setUpdate] = useState(false);
  const timedOut = useRef(false);
  if (navigation.state != "loading") {
    timedOut.current = false;
  }

  useEffect(() => {
    if (navigation.state == "loading") {
      const timeout = setTimeout(() => {
        setUpdate((update) => !update);
        timedOut.current = true;
      }, LOADING_TIME);
      return () => clearTimeout(timeout);
    }
  }, [navigation.state]);

  return timedOut.current ? (
    <Loading />
  ) : (
    <SpoilerWarning>
      <Outlet />
    </SpoilerWarning>
  );
}

function LoaderComponent() {
  const loader = useLoaderData() as {
    component: React.MemoExoticComponent<FunctionComponent>;
  };

  const Component = useMemo(() => memo(loader.component), [loader]);

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

  return updatedError ? (
    <div className="commoncontainer">
      <h2>Page may have been updated. Attmepting to reload.</h2>
    </div>
  ) : (
    <Fallback error={error} className="commoncontainer" />
  );
}

function shouldRevalidate() {
  return false;
}

const routes: Array<RouteObject> = [
  {
    path: ":lang?/",
    Component: Root,
    errorElement: <RouteError />,
    hydrateFallbackElement: <Loading />,
    shouldRevalidate: shouldRevalidate,
    children: [
      {
        element: <LoaderComponent />,
        path: "",
        loader: () => import("./Home").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "beastiepedia/:beastie?",
        loader: () =>
          import("./Beastiepedia/Beastiepedia").then((m) => ({
            component: m.default,
          })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "playdex/",
        loader: () =>
          import("./Playdex/Playdex").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "map/",
        loader: () =>
          import("./Map/Map").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "beastdle/",
        loader: () =>
          import("./Beastdle/Beastdle").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },

      // OLD TEAM VIEWER REDIRECT
      {
        element: <Navigate to="/team/viewer/" />,
        path: "teams/",
      },
      {
        element: <Navigate to="/team/viewer/" />,
        path: "teams/viewer/",
      },
      {
        Component: () => <Navigate to={`/team/viewer/${useParams().code}`} />,
        path: "teams/:code",
      },
      {
        element: <Navigate to="/team/builder/" />,
        path: "teams/builder/",
      },

      {
        element: <LoaderComponent />,
        path: "team/",
        loader: () =>
          import("./Team/Team").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "team/viewer/:code?",
        loader: () =>
          import("./Team/Viewer/TeamViewer").then((m) => ({
            component: m.default,
          })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "team/builder/",
        loader: () =>
          import("./Team/Builder/TeamBuilder").then((m) => ({
            component: m.default,
          })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "team/encounters/:encounterId?",
        loader: () =>
          import("./Team/Encounters/Encounters").then((m) => ({
            component: m.default,
          })),
        shouldRevalidate: shouldRevalidate,
      },

      {
        element: <LoaderComponent />,
        path: "modding/save/",
        loader: () =>
          import("./Modding/Save/Save").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "modding/",
        loader: () =>
          import("./Modding/Modding").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <LoaderComponent />,
        path: "test/",
        loader: () => import("./Test").then((m) => ({ component: m.default })),
        shouldRevalidate: shouldRevalidate,
      },
      {
        element: <PageNotFound />,
        path: "*",
      },
    ],
  },
];
export { routes };
