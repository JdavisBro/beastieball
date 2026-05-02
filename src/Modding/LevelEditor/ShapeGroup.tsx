import * as THREE from "three";

import type { LevelData, ShapeGroup, Shape } from "./types";
import WORLD_DATA, { LevelStump } from "../../data/WorldData";
import { bgrDecimalToHex, bgrDecimalToRgb } from "../../utils/color";
import { useLoader } from "@react-three/fiber";

const SHAPE_VERTEX = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const SHAPE_FRAGMENT = `
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D uTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;
uniform int uChannelSide;
uniform vec3 uBaseColorSide;
uniform vec3 uTexColorSide;
void main(void)
{
  // vec2 new_uv = mod(vUv*0.001, 1.0);
  vec2 new_uv = vUv*0.0005;
  bool is_top = vNormal.z > 0.99;
  int channel = is_top ? uChannel : uChannelSide; 
  float blend_factor = pow(texture2D(uTexture, new_uv)[channel]*texture2D(uTexture, vec2(new_uv.x*-1.618, new_uv.y*1.413))[channel], .5); 
  gl_FragColor.rgb = is_top ? mix(uBaseColor, uTexColor, blend_factor) : mix(uBaseColorSide, uTexColorSide, blend_factor); 
  gl_FragColor.a = 1.0;

  // gl_FragColor = texture2D(uTexture, mod(vUv*0.001, 1.0));
}
`;

function ShapeTexture({
  colorA,
  colorB,
  channelTop,
  sideColorA,
  sideColorB,
  channelSide,
  position,
  shape_three,
  thickness: z,
}: {
  colorA: number;
  colorB: number;
  channelTop: number;
  sideColorA: number;
  sideColorB: number;
  channelSide: number;
  position: number[];
  shape_three: THREE.Shape;
  thickness: number;
}) {
  const texture = useLoader(
    THREE.TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/sprMASTER_TEXTURE/0.png`,
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return (
    <mesh position={[-position[0], position[1], position[2]]}>
      <extrudeGeometry args={[shape_three, { depth: z }]} />
      <meshStandardMaterial map={texture} />
      <shaderMaterial
        fragmentShader={SHAPE_FRAGMENT}
        vertexShader={SHAPE_VERTEX}
        uniforms={{
          uTexture: { value: texture },
          uBaseColor: { value: bgrDecimalToRgb(colorA) },
          uTexColor: { value: bgrDecimalToRgb(colorB) },
          uChannelTop: { value: channelTop },
          uBaseColorSide: { value: bgrDecimalToRgb(sideColorA) },
          uTexColorSide: { value: bgrDecimalToRgb(sideColorB) },
          uChannelSide: {
            value: channelSide,
          },
        }}
      />
      {/* <meshStandardMaterial
              // color={shape.water ? "blue" : `hsl(${z % 360}, 100%, 50%)`}
              color={"#" + bgrDecimalToHex(colorA)}
            /> */}
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

  if (!solid && !thickness && !shape.water) {
    return null;
  }

  const colorA =
    palette[(shape.palette_reference?.base_index ?? 0) % palette.length];
  const colorB =
    palette[(shape.palette_reference?.texture_index ?? 1) % palette.length];
  const sidePalette = shape.side_palette_reference ?? shape.palette_reference;
  const sideColorA = palette[(sidePalette?.base_index ?? 0) % palette.length];
  const sideColorB =
    palette[(sidePalette?.texture_index ?? 1) % palette.length];

  return (
    <ShapeTexture
      colorA={colorA}
      colorB={colorB}
      channelTop={shape.palette_reference?.channel_index ?? 0}
      sideColorA={sideColorA}
      sideColorB={sideColorB}
      channelSide={sidePalette?.channel_index ?? 0}
      position={position}
      shape_three={shape_three}
      thickness={thickness || z}
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
  if (levelData.floor_style == 2) {
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
  const palette_reference = levelData.palette_reference;
  const colorA = palette[(palette_reference?.base_index ?? 0) % palette.length];
  const colorB =
    palette[(palette_reference?.texture_index ?? 1) % palette.length];

  return (
    <ShapeTexture
      colorA={colorA}
      colorB={colorB}
      channelTop={0}
      sideColorA={colorA}
      sideColorB={colorB}
      channelSide={0}
      position={[0, 0, -1]}
      shape_three={shape}
      thickness={0}
    />
  );

  return (
    <mesh
      position={[
        -(levelStump?.world_x1 ?? 0) + width / 2,
        (levelStump?.world_y1 ?? 0) + height / 2,
        -1,
      ]}
    >
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={`orange`} />
    </mesh>
  );
}
