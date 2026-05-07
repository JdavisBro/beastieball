import { useNavigate, useParams } from "react-router-dom";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Object3D, Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Canvas, extend, useThree } from "@react-three/fiber";

import { LevelData } from "./types";
import ShapeGroup, { LevelFloor } from "./ShapeGroup";
import { Models } from "./Models";
import ObjectDrawers from "./ObjectDrawers";
import styles from "./LevelEditor.module.css";
import { EditorViewMode, LevelEditorContext } from "./useLevelEditor";
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
    console.log(levelData[ELEPHANT_CIRCULAR], circular_refs);
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
            !shape.wall_collider
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

function OrbitControlsElement({ levelStump }: { levelStump: LevelStump }) {
  const {
    camera,
    gl: { domElement },
    invalidate,
  } = useThree();

  const ref = useRef<OrbitControls>(null);

  useEffect(() => {
    const orbit = ref.current;
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
    ref.current?.addEventListener("change", handleChange);
    return () => ref.current?.removeEventListener("change", handleChange);
  });

  return <OrbitControls_Element args={[camera, domElement]} ref={ref} />;
}

function Scene({
  levelStump,
  levelData,
}: {
  levelStump: LevelStump;
  levelData: LevelData;
}) {
  return (
    <>
      <OrbitControlsElement levelStump={levelStump} />
      <ambientLight intensity={1} />
      <directionalLight position={[500, 500, 500]} intensity={Math.PI} />
      {levelData.shape_groups_array?.map((shape_group, index) => (
        <ShapeGroup
          key={index}
          shapeGroup={shape_group}
          levelData={levelData}
        />
      ))}
      <Models levelStump={levelStump} levelData={levelData} />
      <ObjectDrawers levelData={levelData} />
      <LevelFloor levelStump={levelStump} levelData={levelData} />
    </>
  );
}

export default function LevelEditor() {
  const { level } = useParams();

  Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

  const [levelData, setLevelData] = useState<undefined | LevelData>(undefined);

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
      .then((data) => setLevelData(ParseLevelData(data, []) as LevelData))
      .catch((reason) => {
        console.log(reason);
        setLevelData(undefined);
      });
  }, [level]);

  const [viewMode, setViewMode] = useState(EditorViewMode.Visible);

  const navigate = useNavigate();

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
      </div>
      <Canvas className={styles.canvas} frameloop="demand">
        <LevelEditorContext.Provider
          value={useMemo(() => ({ viewMode: viewMode }), [viewMode])}
        >
          <Suspense fallback={null}>
            {levelStump && levelData && (
              <Scene levelStump={levelStump} levelData={levelData} />
            )}
          </Suspense>
        </LevelEditorContext.Provider>
      </Canvas>
    </div>
  );
}
