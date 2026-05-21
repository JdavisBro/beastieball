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

function pointDirection(v0: Vector3, v1: Vector3) {
  const x = v1.x - v0.x;
  const y = v1.y - v0.y;
  if (x == 0) {
    if (y > 0) return 270;
    else if (y < 0) return 90;
    return 0;
  } else {
    const dd = Math.atan2(y, x);
    if (dd <= 0) return -dd;
    return Math.PI * 2 - dd;
  }
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
    let uv_y = up ? 1 : 2;
    for (let i = 0; i < 3; i++) {
      const pos = poses[i];
      position[i * 3 + i3] = -(pos[0] + x);
      position[i * 3 + i3 + 1] = pos[1] + y;
      position[i * 3 + i3 + 2] = pos[2] + z;
      uv[i * 2 + i2] =
        (100_000 +
          (up ? pos[uv_x] + uv_offsets[uv_x] : pos[0] - pos[1] + x - y)) *
        (up ? -1 : 1);
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
    let v0 = new Vector3(
      points[points.length - 6],
      points[points.length - 5],
      points[points.length - 4],
    );
    let v1 = new Vector3(
      points[points.length - 3],
      points[points.length - 2],
      points[points.length - 1],
    );
    for (let i = 0; i < points.length; i += 3) {
      const v2 = new Vector3(points[i], points[i + 1], points[i + 2]);
      let o_x1 = 0;
      let o_x2 = 0;
      let o_y1 = 0;
      let o_y2 = 0;
      if (shape.fan) {
        const fan = shape.fan ?? 0;
        const v3 = new Vector3(points[i + 3], points[i + 4], points[i + 5]);
        const a0 = pointDirection(v0, v1) + Math.PI / 2;
        const a1 = pointDirection(v1, v2) + Math.PI / 2;
        const a2 = pointDirection(v2, v3) + Math.PI / 2;
        const normal_x1 = Math.cos(a0) + Math.cos(a1);
        const normal_y1 = -Math.sin(a0) - Math.sin(a1);
        const inverse_length1 =
          1 / Math.sqrt(normal_x1 * normal_x1 + normal_y1 * normal_y1);
        o_x1 = normal_x1 * inverse_length1 * fan;
        o_y1 = normal_y1 * inverse_length1 * fan;

        let normal_x2 = Math.cos(a1) + Math.cos(a2);
        let normal_y2 = -Math.sin(a1) - Math.sin(a2);
        const inverse_length2 =
          1 / Math.sqrt(normal_x2 * normal_x2 + normal_y2 * normal_y2);
        o_x2 = normal_x2 * inverse_length2 * fan;
        o_y2 = normal_y2 * inverse_length2 * fan;
      }

      const tri = (i / 3) * 2;
      insertTriangle(
        tri,
        [v1.x, v1.y, v1.z],
        [v1.x - o_x1, v1.y - o_y1, v1.z - thickness],
        [v2.x - o_x2, v2.y - o_y2, v2.z - thickness],
        false,
      );
      insertTriangle(
        tri + 1,
        [v1.x, v1.y, v1.z],
        [v2.x - o_x2, v2.y - o_y2, v2.z - thickness],
        [v2.x, v2.y, v2.z],
        false,
      );
      v0 = v1;
      v1 = v2;
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
          position={[
            -position[0],
            position[1],
            position[2] + thickness + 15 + (shape.z ?? 0),
          ]}
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
