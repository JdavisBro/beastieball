import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

import { useLoader } from "@react-three/fiber";
import WORLD_DATA, { LevelStump } from "../../data/WorldData";
import type { LevelData, Model } from "./types";
import {
  DoubleSide,
  Mesh,
  Object3D,
  RepeatWrapping,
  TextureLoader,
} from "three";
import { findFloorPosition } from "./LevelEditor";
import {
  MaterialShader,
  MeshColoredShader,
  TexturedColoredShader,
  TexturedShader,
} from "./MaterialShader";
import { bgrDecimalToHex } from "../../utils/color";

function deg2rad(deg: number) {
  return (deg / 180) * Math.PI;
}

function ModelChild({
  child,
  model,
  levelData,
  x,
  y,
  z,
  u_scale,
}: {
  child: Mesh | Object3D;
  model: Model;
  levelData: LevelData;
  x: number;
  y: number;
  z: number;
  u_scale: number;
}) {
  const [name, texture_name, texture_slotS, palette_slot, index, colorS] =
    child.name.split("#");

  const collider = name.includes("COLLIDER") && !name.includes("VISIBLE");

  if (collider) return null;

  const texture_slot = Number(texture_slotS);
  const color = Number(colorS);
  const palette = WORLD_DATA.palettes[levelData.palette_name ?? "cliffs"];
  const paletteRef =
    model?.palettes?.array?.[
      Math.max(0, Number(palette_slot) - 1) % model.palettes.array.length
    ];

  return (child as { isMesh: boolean }).isMesh ? (
    <mesh
      onClick={() =>
        console.log(
          model,
          child,
          WORLD_DATA.palettes[levelData.palette_name ?? "cliffs"],
        )
      }
      position={[-x, y, z]}
      rotation={[
        deg2rad(model.x_angle ?? 0),
        deg2rad(model.y_angle ?? 0),
        deg2rad(model.z_angle ?? 0),
      ]}
      geometry={(child as Mesh).geometry}
      scale={[
        (model.x_scale ?? 300) * u_scale,
        (model.y_scale ?? 300) * u_scale,
        (model.z_scale ?? 300) * u_scale,
      ]}
    >
      {texture_slot >= 100 ? (
        <TexturedShader textureName={texture_name} />
      ) : texture_slot >= 99 ? (
        <TexturedColoredShader
          textureName={texture_name}
          paletteRef={paletteRef}
          palette={palette}
        />
      ) : color > -1 ? (
        <meshBasicMaterial
          color={"#" + bgrDecimalToHex(color)}
          side={DoubleSide}
        />
      ) : (
        <MeshColoredShader palette={palette} paletteRef={paletteRef} />
      )}
    </mesh>
  ) : null;
}

export function ModelElem({
  model,
  levelData,
  useFloorPos,
}: {
  model: Model;
  levelData: LevelData;
  useFloorPos?: boolean;
}) {
  const model_obj = useLoader(
    OBJLoader,
    `${import.meta.env.VITE_DATA_URL}models_obj/${model.model_filename}.obj`,
  );

  if ((model.effect_layer ?? 0) > 0) return;
  const x = model.x ?? 0;
  const y = model.y ?? 0;
  const z =
    (useFloorPos ?? true)
      ? findFloorPosition(x, y, levelData) + (model.z ?? 0)
      : (model?.z ?? 0);
  if (model.model_filename == "sport_shop")
    console.log(model.model_filename, z);
  // const z = ;
  //
  const u_scale = model.u_scale ?? 1;
  return model_obj.children.map((child) => (
    <ModelChild
      key={child.name}
      child={child}
      model={model}
      levelData={levelData}
      x={x}
      y={y}
      z={z}
      u_scale={u_scale}
    />
  ));
}

export function Models({
  levelStump,
  levelData,
}: {
  levelStump: LevelStump;
  levelData: LevelData;
}) {
  return levelData.models_array?.map((model, index) => (
    <ModelElem key={index} model={model} levelData={levelData} />
  ));
}
