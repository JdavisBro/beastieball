import * as THREE from "three";

import type { LevelData, ShapeGroup, Shape, PaletteReference } from "./types";
import WORLD_DATA, { LevelStump } from "../../data/WorldData";
import { MaterialShader } from "./MaterialShader";

function ShapeTexture({
  position,
  shape_three,
  thickness,
  paletteTop,
  paletteSide,
  palette,
  onClick,
}: {
  position: number[];
  shape_three: THREE.Shape;
  thickness: number;
  paletteTop?: PaletteReference;
  paletteSide?: PaletteReference;
  palette: number[];
  onClick?: React.MouseEventHandler;
}) {
  return (
    <mesh position={[-position[0], position[1], position[2]]} onClick={onClick}>
      <extrudeGeometry args={[shape_three, { depth: thickness }]} />
      <MaterialShader
        paletteTop={paletteTop}
        paletteSide={paletteSide}
        palette={palette}
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
  const shape_three = new THREE.Shape();

  const z = (shape.z ?? 0) + (shape?.points_array?.[2] ?? 0);
  const thickness = (shape.thickness ?? 0) || (shape.z ?? 0);
  position[2] += (z - thickness) / 2;
  const solid = shape.solid ? true : false;
  if (shape.points_array && shape.flat && (shape.visible ?? true)) {
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

  if (!(shape.visible ?? true) || (!solid && !shape.water)) {
    return null;
  }

  return (
    <ShapeTexture
      palette={palette}
      paletteTop={shape.palette_reference}
      paletteSide={shape.side_palette_reference}
      position={position}
      shape_three={shape_three}
      thickness={thickness || z}
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
  return shapeGroup.shapes_array?.map((shape) => (
    <Shape
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

  const shape = new THREE.Shape();
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
