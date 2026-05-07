import { DoubleSide, Mesh, Object3D } from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { useLoader } from "@react-three/fiber";

import type { Model } from "./types";
import { findFloorPosition } from "./LevelEditor";
import {
  MeshColoredShader,
  TexturedColoredShader,
  TexturedShader,
} from "./MaterialShader";
import useLevelEditor, { EditorViewMode } from "./useLevelEditor";
import { bgrDecimalToHex } from "../../utils/color";

function deg2rad(deg: number) {
  return (deg / 180) * Math.PI;
}

function ModelChild({
  child,
  model,
  position,
}: {
  child: Mesh | Object3D;
  model: Model;
  position: [number, number, number];
}) {
  const [name, texture_name, texture_slotS, palette_slot, _index, colorS] =
    child.name.split("#");

  const collider = name.includes("COLLIDER");
  const visible = !collider || name.includes("VISIBLE");

  const { viewMode } = useLevelEditor();
  if (
    !(
      viewMode == EditorViewMode.All ||
      (viewMode == EditorViewMode.Collision && collider) ||
      (viewMode == EditorViewMode.Visible && visible)
    )
  )
    return null;

  const u_scale = model.u_scale ?? 1;
  const texture_slot = Number(texture_slotS);
  const color = Number(colorS);
  const paletteRef =
    model?.palettes?.array?.[
      Math.max(0, Number(palette_slot) - 1) % model.palettes.array.length
    ];

  return (child as { isMesh: boolean }).isMesh ? (
    <mesh
      onClick={() => console.log(model, child)}
      position={position}
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
        />
      ) : color > -1 ? (
        <meshBasicMaterial
          color={"#" + bgrDecimalToHex(color)}
          side={DoubleSide}
        />
      ) : (
        <MeshColoredShader paletteRef={paletteRef} />
      )}
    </mesh>
  ) : null;
}

export function ModelElem({
  model,
  useFloorPos,
}: {
  model: Model;
  useFloorPos?: boolean;
}) {
  const { levelData } = useLevelEditor();
  const model_obj = useLoader(
    OBJLoader,
    `${import.meta.env.VITE_DATA_URL}models_obj/${model.model_filename}.obj`,
  );

  const { viewMode } = useLevelEditor();
  if (viewMode == EditorViewMode.Visible && (model.effect_layer ?? 0) > 0)
    return;
  const x = model.x ?? 0;
  const y = model.y ?? 0;
  const z =
    (useFloorPos ?? true)
      ? findFloorPosition(x, y, levelData) + (model.z ?? 0)
      : (model?.z ?? 0);
  return model_obj.children.map((child) => (
    <ModelChild
      key={child.name}
      child={child}
      model={model}
      position={[-x, y, z]}
    />
  ));
}

export function Models() {
  const { levelData } = useLevelEditor();
  return levelData.models_array?.map((model, index) => (
    <ModelElem key={index} model={model} />
  ));
}
