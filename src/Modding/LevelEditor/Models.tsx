import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

import { useLoader } from "@react-three/fiber";
import WORLD_DATA, { LevelStump } from "../../data/WorldData";
import type { LevelData, Model } from "./types";
import { Mesh, Object3D, RepeatWrapping, TextureLoader } from "three";
import { findFloorPosition } from "./LevelEditor";
import { MaterialShader, TexturedShader } from "./MaterialShader";
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
  const [name, texture_name, texture_slot, palette_slot, index, colorS] =
    child.name.split("#");
  const collider =
    name.includes("COLLIDER") && !name.includes("COLLIDER_VISIBLE");
  if (collider) return null;
  const color = Number(colorS);
  return (child as { isMesh: boolean }).isMesh ? (
    <mesh
      onClick={() => console.log(model, child)}
      castShadow
      receiveShadow
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
      {texture_name.length && false ? (
        <TexturedShader textureName={texture_name} />
      ) : color > -1 ? (
        <meshBasicMaterial color={"#" + bgrDecimalToHex(color)} />
      ) : (
        <MaterialShader
          palette={WORLD_DATA.palettes[levelData.palette_name ?? "cliffs"]}
          paletteTop={
            model?.palettes?.array?.[
              Math.max(0, Number(palette_slot) - 1) %
                model.palettes.array.length
            ]
          }
          doubleSide={true}
        />
      )}
    </mesh>
  ) : null;
}

function Model({ model, levelData }: { model: Model; levelData: LevelData }) {
  const model_obj = useLoader(
    OBJLoader,
    `${import.meta.env.VITE_DATA_URL}models_obj/${model.model_filename}.obj`,
  );

  const x = model.x ?? 0;
  const y = model.y ?? 0;
  const z =
    findFloorPosition(x, y, levelData, model.model_filename == "sport_shop") +
    (model.z ?? 0);
  if (model.model_filename == "sport_shop")
    console.log(model.model_filename, z);
  // const z = ;
  //
  const u_scale = model.u_scale ?? 1;
  return model_obj.children.map((child) => (
    <ModelChild
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
  return levelData.models_array?.map((model) => (
    <Model model={model} levelData={levelData} />
  ));
}
