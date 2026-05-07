import { Shape as ShapeThree } from "three";

import type { LevelData, ShapeGroup, Shape, PaletteReference } from "./types";
import { MaterialShader } from "./MaterialShader";
import useLevelEditor, { EditorViewMode } from "./useLevelEditor";
import WORLD_DATA, { LevelStump } from "../../data/WorldData";

function ShapeTexture({
  position,
  rotation,
  shape_three,
  thickness,
  paletteTop,
  paletteSide,
  palette,
  clipTop,
  onClick,
}: {
  position: number[];
  rotation?: [number, number, number];
  shape_three: ShapeThree;
  thickness: number;
  paletteTop?: PaletteReference;
  paletteSide?: PaletteReference;
  palette: number[];
  clipTop?: boolean;
  onClick?: React.MouseEventHandler;
}) {
  return (
    <mesh
      position={[-position[0], position[1], position[2]]}
      rotation={rotation}
      onClick={onClick}
    >
      <extrudeGeometry args={[shape_three, { depth: thickness }]} />
      <MaterialShader
        paletteTop={paletteTop}
        paletteSide={paletteSide}
        palette={palette}
        clipTop={clipTop}
        doubleSide={clipTop}
      />
    </mesh>
  );
}

function Shape({
  position,
  shape,
  palette,
}: {
  position: number[];
  shape: Shape;
  palette: number[];
}) {
  const shape_three = new ShapeThree();

  const z = (shape.z ?? 0) + (shape?.points_array?.[2] ?? 0);
  const thickness = (shape.thickness ?? 0) || (shape.z ?? 0);
  // yeah idk
  if (import.meta.env.DEV) position[2] += (z - thickness) / 2;
  else position[2] += z - thickness;

  const { viewMode } = useLevelEditor();

  const solid = (shape.solid ?? false) || (shape.water ?? false);
  const flat = shape.flat ?? false;
  const visible =
    viewMode == EditorViewMode.All ||
    (viewMode == EditorViewMode.Collision && solid && flat) ||
    (viewMode == EditorViewMode.Visible && (shape.visible ?? true));

  if (shape.points_array && visible) {
    const x = -(shape.x ?? 0);
    const y = shape.y ?? 0;
    for (let i = 0; i < shape.points_array?.length; i += 3) {
      if (i == 0) {
        shape_three.moveTo(
          x + -shape.points_array[i],
          y + shape.points_array[i + 1],
        );
      } else {
        shape_three.lineTo(
          x + -shape.points_array[i],
          y + shape.points_array[i + 1],
        );
      }
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <ShapeTexture
      palette={palette}
      paletteTop={shape.palette_reference}
      paletteSide={shape.side_palette_reference}
      position={position}
      shape_three={shape_three}
      thickness={flat ? thickness || (solid && z) || 1 : 1}
      rotation={flat ? undefined : [-Math.PI / 2, 0, 0]}
      clipTop={shape.wall_collider}
      onClick={() => console.log(shape)}
    />
  );
}

export default function ShapeGroup({
  shapeGroup,
  levelData,
}: {
  shapeGroup: ShapeGroup;
  levelData: LevelData;
}) {
  const palette = WORLD_DATA.palettes[levelData.palette_name ?? "cliffs"];
  return shapeGroup.shapes_array?.map((shape, index) => (
    <Shape
      key={index}
      position={[shapeGroup.x ?? 0, shapeGroup.y ?? 0, shapeGroup.z ?? 0]}
      shape={shape}
      palette={palette}
    />
  ));
}

export function LevelFloor({
  levelStump,
  levelData,
}: {
  levelStump: LevelStump;
  levelData: LevelData;
}) {
  if (levelData.floor_style == 2 || (levelStump.is_indoor ?? false)) {
    return null;
  }

  const shape = new ShapeThree();
  const width = -((levelStump?.world_x2 ?? 0) - (levelStump?.world_x1 ?? 0));
  const height = (levelStump?.world_y2 ?? 0) - (levelStump?.world_y1 ?? 0);
  shape.moveTo(0, 0);
  shape.lineTo(width, 0);
  shape.lineTo(width, height);
  shape.lineTo(0, height);

  const palette = WORLD_DATA.palettes[levelData.palette_name ?? "cliffs"];

  return (
    <ShapeTexture
      palette={palette}
      paletteTop={levelData.palette_reference}
      position={[0, 0, -1]}
      shape_three={shape}
      thickness={0}
    />
  );
}
