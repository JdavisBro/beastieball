import {
  BufferAttribute,
  BufferGeometry,
  Shape as ShapeThree,
  Vector3,
} from "three";
import { useMemo } from "react";
import { Earcut } from "three/src/extras/Earcut.js";

import type { ShapeGroup, Shape, PaletteReference } from "./types";
import { MaterialShader, WaterShiny } from "./MaterialShader";
import useLevelEditor, { EditorViewMode } from "./useLevelEditor";

function ShapeTexture({
  position,
  rotation,
  geometry,
  paletteTop,
  paletteSide,
  clipTop,
  onClick,
}: {
  position: number[];
  rotation?: [number, number, number];
  geometry: BufferGeometry;
  thickness: number;
  paletteTop?: PaletteReference;
  paletteSide?: PaletteReference;
  clipTop?: boolean;
  onClick?: React.MouseEventHandler;
}) {
  return (
    <mesh
      position={[-position[0], position[1], position[2]]}
      rotation={rotation}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <primitive object={geometry} />
      <MaterialShader
        paletteTop={paletteTop}
        paletteSide={paletteSide}
        clipTop={clipTop}
        doubleSide={clipTop}
      />
    </mesh>
  );
}

export function createShapeGeometry(shape: Shape, thickness: number) {
  const geometry = new BufferGeometry();
  const points = shape.points_array;
  if (!points) return geometry;
  const top = Earcut.triangulate(points, [], 3);
  const point_count = thickness > 0 ? points.length : 0;
  const position = new Float32Array(point_count * 3 * 2 + top.length * 3 * 2);
  const uv = new Float32Array(point_count * 2 * 2 + top.length * 2 * 2);
  const x = shape.x ?? 0;
  const y = shape.y ?? 0;
  const z = shape.z ?? 0;

  const insertTriangle = (
    index: number,
    pos1: [number, number, number],
    pos2: [number, number, number],
    pos3: [number, number, number],
    up: boolean,
  ) => {
    const i3 = index * 3 * 3;
    const i2 = index * 3 * 2;
    const poses = [pos1, pos2, pos3];
    const uv_offsets = [x, y, z];
    let uv_x = 0;
    let uv_y = 1;
    if (!up) {
      const x_diff = Math.abs(pos1[0] - pos2[0] || pos2[0] - pos3[0]);
      const y_diff = Math.abs(pos1[1] - pos2[1] || pos2[1] - pos3[1]);
      uv_x = x_diff > y_diff ? 0 : 1;
      uv_y = 2;
    }
    for (let i = 0; i < 3; i++) {
      const pos = poses[i];
      position[i * 3 + i3] = -(pos[0] + x);
      position[i * 3 + i3 + 1] = pos[1] + y;
      position[i * 3 + i3 + 2] = pos[2] + z;
      uv[i * 2 + i2] = (pos[uv_x] + uv_offsets[uv_x]) * (uv_x == 0 ? -1 : 1);
      uv[i * 2 + i2 + 1] =
        (pos[uv_y] + uv_offsets[uv_y]) * (uv_y == 0 ? -1 : 1);
    }
  };

  for (let i = 0; i < top.length; i += 3) {
    const point1 = top[i] * 3;
    const point2 = top[i + 1] * 3;
    const point3 = top[i + 2] * 3;
    const tri = i / 3;
    insertTriangle(
      (point_count / 3) * 2 + tri,
      [points[point2], points[point2 + 1], points[point2 + 2]],
      [points[point1], points[point1 + 1], points[point1 + 2]],
      [points[point3], points[point3 + 1], points[point3 + 2]],
      true,
    );
    insertTriangle(
      (point_count / 3) * 2 + top.length / 3 + tri,
      [points[point1], points[point1 + 1], points[point1 + 2] - thickness],
      [points[point2], points[point2 + 1], points[point2 + 2] - thickness],
      [points[point3], points[point3 + 1], points[point3 + 2] - thickness],
      true,
    );
  }
  if (point_count) {
    let v2 = new Vector3(
      points[points.length - 3],
      points[points.length - 2],
      points[points.length - 1],
    );
    for (let i = 0; i < points.length; i += 3) {
      const v1 = new Vector3(points[i], points[i + 1], points[i + 2]);

      const tri = (i / 3) * 2;
      insertTriangle(
        tri,
        [v2.x, v2.y, v2.z],
        [v2.x, v2.y, v2.z - thickness],
        [v1.x, v1.y, v1.z],
        false,
      );
      insertTriangle(
        tri + 1,
        [v1.x, v1.y, v1.z],
        [v2.x, v2.y, v2.z - thickness],
        [v1.x, v1.y, v1.z - thickness],
        false,
      );
      v2 = v1;
    }
  }
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("uv", new BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function Shape({
  position,
  shape,
}: {
  position: [number, number, number];
  shape: Shape;
}) {
  const shape_three = new ShapeThree();

  const thickness =
    shape.flat && shape.solid
      ? shape.thickness && shape.thickness > 0
        ? shape.thickness
        : (shape.z ?? 0)
      : 0;

  const { viewMode, levelData } = useLevelEditor();

  const solid = (shape.solid ?? false) || (shape.water ?? false);
  const flat = shape.flat ?? false;
  const visible =
    viewMode == EditorViewMode.All ||
    (viewMode == EditorViewMode.Collision && solid && flat) ||
    (viewMode == EditorViewMode.Visible && (shape.visible ?? true) && solid);

  const geometry = useMemo(
    () => createShapeGeometry(shape, thickness),
    [shape],
  );

  let paletteTop = shape.palette_reference;
  let paletteSide = shape.side_palette_reference;
  if (shape.water) {
    const water_palette = levelData.water_color;
    const base = water_palette?.base_index ?? 0;
    paletteTop = {
      _: "class_palette_reference",
      base_index: base,
      texture_index: base,
    };
    paletteSide = paletteTop;
  }

  return visible ? (
    <>
      <ShapeTexture
        paletteTop={paletteTop}
        paletteSide={paletteSide}
        position={position}
        geometry={geometry}
        thickness={thickness}
        rotation={flat ? undefined : [-Math.PI / 2, 0, 0]}
        clipTop={shape.wall_collider}
        onClick={() => console.log(shape)}
      />
      {shape.water && (
        <mesh
          position={[-position[0], position[1], position[2] + thickness + 15]}
          receiveShadow
        >
          <shapeGeometry args={[shape_three]} />
          <WaterShiny />
        </mesh>
      )}
    </>
  ) : null;
}

function ShapeGroup({ shapeGroup }: { shapeGroup: ShapeGroup }) {
  return shapeGroup.shapes_array?.map((shape, index) => (
    <Shape
      key={index}
      position={[shapeGroup.x ?? 0, shapeGroup.y ?? 0, shapeGroup.z ?? 0]}
      shape={shape}
    />
  ));
}

export default function ShapeGroups() {
  const { levelData } = useLevelEditor();
  return levelData.shape_groups_array?.map((shape_group, index) => (
    <ShapeGroup key={index} shapeGroup={shape_group} />
  ));
}

export function LevelFloor() {
  const { levelData, levelStump } = useLevelEditor();
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

  return (
    <mesh position={[0, 0, -1]} castShadow receiveShadow>
      <shapeGeometry args={[shape]} />
      <MaterialShader paletteTop={levelData.palette_reference} doubleSide />
    </mesh>
  );
}
