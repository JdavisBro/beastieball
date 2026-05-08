import { useNavigate, useParams } from "react-router-dom";
import {
  RefObject,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DirectionalLight, Object3D, Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { useLocalStorage } from "usehooks-ts";

import { LevelData } from "./types";
import ShapeGroups, { LevelFloor } from "./ShapeGroup";
import { Models } from "./Models";
import ObjectDrawers from "./ObjectDrawers";
import styles from "./LevelEditor.module.css";
import useLevelEditor, {
  EditorViewMode,
  LevelEditorContext,
  LevelEditorContextType,
} from "./useLevelEditor";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import WORLD_DATA, { LevelStump } from "../../data/WorldData";

const AREA_ID_DIRS = [
  "etc/",
  "demo/",
  "area01/",
  "area02/",
  "area03/",
  "area04/",
  "",
];

const ELEPHANT_CIRCULAR = "__Elephant_Circular_Ref__";

const IGNORED_KEYS = [
  "_",
  "__Elephant_Constructor__",
  "__Elephant_Schema_Version__",
];

function ParseLevelData(
  levelData: Record<string, unknown> | unknown[],
  circular_refs: unknown[],
) {
  if (!Array.isArray(levelData) && ELEPHANT_CIRCULAR in levelData) {
    if (typeof levelData[ELEPHANT_CIRCULAR] != "number")
      console.log("NON NUMBER CIRCULAR REFERENCE");
    return circular_refs[(levelData[ELEPHANT_CIRCULAR] as number) + 1];
  }
  circular_refs.push(levelData);

  const keys = Object.keys(levelData as object);
  if (!Array.isArray(levelData)) keys.sort();
  for (const key of keys) {
    if (IGNORED_KEYS.includes(key)) continue;
    const value = Array.isArray(levelData)
      ? levelData[Number(key)]
      : levelData[key];
    if (Array.isArray(value) || (typeof value == "object" && value)) {
      const data = ParseLevelData(
        value as Record<string, unknown> | unknown[],
        circular_refs,
      );
      if (Array.isArray(levelData)) levelData[Number(key)] = data;
      else levelData[key] = data;
    }
  }
  return levelData;
}

function pointInsidePolygon(x: number, y: number, vs: number[][]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
  let inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1];
    const xj = vs[j][0],
      yj = vs[j][1];

    const intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export function findFloorPosition(
  x: number,
  y: number,
  levelData: LevelData,
  z_max?: number,
) {
  let highest_z = 0;
  const z_test = z_max !== undefined;
  if (levelData.shape_groups_array) {
    for (const group of levelData.shape_groups_array) {
      if (group.shapes_array) {
        for (const shape of group.shapes_array) {
          if (
            shape.points_array &&
            (shape.solid || shape.water) &&
            shape.flat &&
            shape.solid &&
            !shape.wall_collider &&
            !shape.shadow_caster
          ) {
            const poly = [];
            const shape_x = (group.x ?? 0) + (shape.x ?? 0);
            const shape_y = (group.y ?? 0) + (shape.y ?? 0);
            for (let i = 0; i < shape.points_array.length; i += 3) {
              poly.push([
                shape_x + shape.points_array[i],
                shape_y + shape.points_array[i + 1],
              ]);
            }
            const z = (group.z ?? 0) + (shape.z ?? 0) + shape.points_array[2];
            if ((!z_test || z_max > z) && pointInsidePolygon(x, y, poly)) {
              if (z > highest_z) highest_z = z;
            }
          }
        }
      }
    }
  }
  return highest_z;
}

const OrbitControls_Element = extend(OrbitControls);

function OrbitControlsElement({
  orbitRef,
}: {
  orbitRef: RefObject<OrbitControls | null>;
}) {
  const {
    camera,
    gl: { domElement },
    invalidate,
  } = useThree();

  const { levelStump } = useLevelEditor();

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;
    camera.near = 3;
    camera.far = 50000;
    orbit.target.set(
      -((levelStump.world_x2 - levelStump.world_x1) / 2),
      (levelStump.world_y2 - levelStump.world_y1) / 2,
      500,
    );
    camera.position.set(
      -(levelStump.world_x2 - levelStump.world_x1) / 2,
      levelStump.world_y2 - levelStump.world_y1 + 2000,
      2000,
    );
    camera.rotation.set(0, 0, 0);
    camera.updateProjectionMatrix();
    orbit.update();
    invalidate();
  }, [levelStump]);

  const handleChange = useCallback(() => invalidate(), [invalidate]);

  useEffect(() => {
    orbitRef.current?.addEventListener("change", handleChange);
    return () => orbitRef.current?.removeEventListener("change", handleChange);
  });

  return <OrbitControls_Element args={[camera, domElement]} ref={orbitRef} />;
}

const SUN_DISTANCE = 8200;

function Scene() {
  const { levelStump, levelData } = useLevelEditor();

  const levelCenterX = -(levelStump.world_x2 - levelStump.world_x1) / 2;
  const levelCenterY = (levelStump.world_y2 - levelStump.world_y1) / 2;

  const sun_dir = ((levelData.sunlight_direction ?? 45) / 180) * Math.PI;
  const sun_ele = ((levelData.sunlight_elevation ?? 45) / 180) * Math.PI;
  const sunlightVector = new Vector3(
    Math.cos(sun_dir) * Math.cos(sun_ele),
    -Math.sin(sun_dir) * Math.cos(sun_ele),
    -Math.sin(sun_ele),
  );
  sunlightVector.normalize();
  const bigLevel = levelCenterX < -5000 || levelCenterY > 5000;

  const { invalidate } = useThree();

  const lightRef = useRef<DirectionalLight>(null);

  const orbitRef = useRef<OrbitControls>(null);

  useLayoutEffect(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(levelCenterX, levelCenterY, 0);
      lightRef.current.target.updateMatrixWorld();
      lightRef.current.shadow.camera.top = 6000;
      lightRef.current.shadow.camera.right = 6000;
      lightRef.current.shadow.camera.bottom = -6000;
      lightRef.current.shadow.camera.left = -6000;
      lightRef.current.shadow.camera.far = 12000;
      lightRef.current.shadow.bias = -0.0005;
      lightRef.current.shadow.normalBias = 6;
      lightRef.current.shadow.radius = 2;
      lightRef.current.shadow.mapSize.set(4096, 4096);
      lightRef.current.shadow.updateMatrices(lightRef.current);
      invalidate();
    }
  }, []);

  useFrame(
    bigLevel
      ? () => {
          if (!lightRef.current || !orbitRef.current) return;
          const cameraPos = orbitRef.current.target;
          lightRef.current.target.position.set(
            cameraPos.x,
            cameraPos.y,
            cameraPos.z,
          );
          lightRef.current.target.updateMatrixWorld();
          lightRef.current.position.set(
            cameraPos.x + SUN_DISTANCE * sunlightVector.x,
            cameraPos.y - SUN_DISTANCE * sunlightVector.y,
            cameraPos.z - SUN_DISTANCE * sunlightVector.z,
          );
          lightRef.current.updateMatrixWorld();
          lightRef.current.shadow.updateMatrices(lightRef.current);
        }
      : () => {},
  );

  return (
    <>
      <OrbitControlsElement orbitRef={orbitRef} />
      <ambientLight intensity={2} />
      <directionalLight
        position={[
          levelCenterX + SUN_DISTANCE * sunlightVector.x,
          levelCenterY - SUN_DISTANCE * sunlightVector.y,
          -SUN_DISTANCE * sunlightVector.z,
        ]}
        intensity={Math.PI / 2}
        castShadow
        ref={lightRef}
      />
      <ShapeGroups />
      <Models />
      <ObjectDrawers />
      <LevelFloor />
    </>
  );
}

function FullscreenHtml({ children }: { children: React.ReactNode }) {
  return (
    <Html
      className={styles.fullbox}
      fullscreen
      prepend
      calculatePosition={(_el, _camera, { width, height }) => [
        width / 2,
        height / 2,
      ]}
    >
      <div>{children}</div>
    </Html>
  );
}

function Loading({ level }: { level?: string }) {
  const progress = useProgress();

  const itemSplit = progress.item.split("/");
  const model = progress.item.endsWith(".obj");

  const item = level
    ? level
    : model || progress.item.includes("level_editor")
      ? itemSplit[itemSplit.length - 1].split(".")[0]
      : itemSplit[itemSplit.length - 2];

  return (
    <FullscreenHtml>
      Loading...
      <br />
      {level ? "Level Data" : model ? "Model" : "Texture"}
      <br />
      {item}
    </FullscreenHtml>
  );
}

function Error({ reason }: { reason?: string }) {
  const level =
    typeof reason == "string" &&
    (reason.includes("NetworkError") || reason.includes("JSON.parse"));

  return (
    <FullscreenHtml>
      Error...
      <img src="/nojs.png" />
      {level ? "Level Loading Failed" : reason}
    </FullscreenHtml>
  );
}

export default function LevelEditor() {
  const { level } = useParams();

  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const [levelData, setLevelData] = useState<undefined | LevelData>(undefined);
  const [loadFailed, setLoadFailed] = useState("");

  const [shadows, setShadows] = useLocalStorage("levelEditorShadows", true);

  const levelStump =
    level != undefined
      ? WORLD_DATA.level_stumps_array.find((stump) => stump.name == level)
      : undefined;

  useEffect(() => {
    setLevelData(undefined);
    if (levelStump == undefined) return;
    const level_prefix = AREA_ID_DIRS[(levelStump.area_id ?? -1) + 1];
    fetch(
      `${import.meta.env.VITE_DATA_URL}world_data/${level_prefix}${level}.json`,
    )
      .then((res) => res.json())
      .then((data) => {
        setLevelData(ParseLevelData(data, []) as LevelData);
        setLoadFailed("");
      })
      .catch((reason) => {
        setLoadFailed((reason as TypeError).message);
        setLevelData(undefined);
      });
  }, [level]);

  const [viewMode, setViewMode] = useState(EditorViewMode.Visible);

  const navigate = useNavigate();

  const context = useMemo<LevelEditorContextType>(
    () => ({
      viewMode,
      levelData: levelData as LevelData,
      levelStump: levelStump as LevelStump,
      palette: WORLD_DATA.palettes[levelData?.palette_name ?? "default"],
    }),
    [viewMode, levelData, levelStump],
  );

  return (
    <div className={styles.container}>
      <OpenGraph
        title={`Level Editor - ${import.meta.env.VITE_BRANDING}`}
        image={"/gameassets/sprMainmenu/3.png"}
        url={"/modding/level/"}
        description={"Level Editor for Beastieball"}
      />
      <Header
        title="Level Editor"
        returnButtonTitle="Beastieball Modding Tools"
        returnButtonTo="/modding/"
        secretPage={true}
      />
      <div className={styles.settings}>
        <label>
          Level:{" "}
          <select
            value={level}
            onChange={(event) =>
              navigate(`/modding/level/${event.currentTarget.value}`)
            }
          >
            {WORLD_DATA.level_stumps_array
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((level) => (
                <option key={level.name} value={level.name}>
                  {level.name}
                </option>
              ))}
          </select>
        </label>
        {" - "}
        <label>
          Custom:{" "}
          <input
            type="file"
            onChange={(event) => {
              const files = event.currentTarget.files;
              if (files) {
                files[0].text().then((data) => setLevelData(JSON.parse(data)));
              }
            }}
          />
        </label>
        {" - "}
        <label>
          View:{" "}
          <select
            onChange={(event) => setViewMode(Number(event.currentTarget.value))}
          >
            <option value={EditorViewMode.Visible}>Only Visible</option>
            <option value={EditorViewMode.Collision}>Only Collision</option>
            <option value={EditorViewMode.All}>All</option>
          </select>
        </label>
        {" - "}
        <label>
          Shadows:{" "}
          <input
            type="checkbox"
            checked={shadows}
            onChange={() => setShadows(!shadows)}
          />
        </label>
      </div>
      <Canvas
        className={styles.canvas}
        frameloop="demand"
        shadows={shadows ? "percentage" : undefined}
        linear
        flat
      >
        {loadFailed.length ? (
          <Error reason={loadFailed} />
        ) : (
          <LevelEditorContext.Provider value={context}>
            <ErrorBoundary
              fallbackRender={(props) => <Error reason={props.error} />}
            >
              <Suspense fallback={<Loading />}>
                {levelStump ? (
                  !levelData ? (
                    <Loading level={level} />
                  ) : (
                    <Scene />
                  )
                ) : null}
              </Suspense>
            </ErrorBoundary>
          </LevelEditorContext.Provider>
        )}
      </Canvas>
    </div>
  );
}
