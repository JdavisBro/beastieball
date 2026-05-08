import {
  DoubleSide,
  IUniform,
  MeshPhongMaterial,
  MeshStandardMaterial,
  TextureLoader,
} from "three";
import { extend, ThreeElement, useLoader } from "@react-three/fiber";

import { PaletteReference } from "./types";
import setTextureDefaults from "./defaults";
import { bgrDecimalToRgb } from "../../utils/color";
import SPRITE_INFO_FULL from "../../data/raw/sprite_info_full.json";
import useLevelEditor from "./useLevelEditor";

function getPaletteColors(
  palette: number[],
  paletteRef?: PaletteReference,
): [number, number] {
  return [
    palette[paletteRef?.base_index ?? 0] ?? 0,
    palette[paletteRef?.texture_index ?? 1] ?? 0,
  ];
}

const FRAGMENT_TOP = "#include <common>\n";
const FRAGMENT_MAP = "#include <map_fragment>\n";
const VERTEX_TOP = "#include <common>\n";
const VERTEX_BEGIN = "#include <begin_vertex>\n";

export const DefaultMaterial = extend(MeshPhongMaterial);

function ExtendedMaterial({
  uniforms,
  defines,
  fragment_top,
  fragment_map,
  vertex_top,
  vertex_begin,
  doubleSide,
  ...props
}: {
  uniforms?: {
    [uniform: string]: IUniform;
  };
  fragment_top?: string;
  fragment_map?: string;
  vertex_top?: string;
  vertex_begin?: string;
  doubleSide?: boolean;
} & ThreeElement<typeof MeshStandardMaterial>) {
  return (
    <DefaultMaterial
      {...props}
      onBeforeCompile={(shader) => {
        shader.fragmentShader = shader.fragmentShader
          .replace(FRAGMENT_TOP, FRAGMENT_TOP + (fragment_top ?? "") + "\n")
          .replace(FRAGMENT_MAP, FRAGMENT_MAP + (fragment_map ?? "") + "\n");
        shader.vertexShader = shader.vertexShader
          .replace(VERTEX_TOP, VERTEX_TOP + (vertex_top ?? "") + "\n")
          .replace(VERTEX_BEGIN, VERTEX_BEGIN + (vertex_begin ?? "") + "\n");
        shader.defines = {
          ...shader.defines,
          ...defines,
          USE_UV: true,
        };
        if (uniforms)
          shader.uniforms = {
            ...shader.uniforms,
            ...uniforms,
          };
      }}
      side={doubleSide ? DoubleSide : undefined}
    />
  );
}

const SHADER_VERTEX_TOP = `varying vec3 vObjectPosition;
varying vec3 vObjectNormal;`;

const SHADER_VERTEX_BEGIN = `vObjectPosition = position * 230.0;
vObjectNormal = normal;`;

export function MaterialShader({
  paletteTop,
  paletteSide,
  doubleSide,
  clipTop,
}: {
  paletteTop?: PaletteReference;
  paletteSide?: PaletteReference;
  doubleSide?: boolean;
  clipTop?: boolean;
}) {
  const texture = useLoader(
    TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/sprMASTER_TEXTURE/0.png`,
  );
  setTextureDefaults(texture);

  const { palette } = useLevelEditor();
  const [colorA, colorB] = getPaletteColors(palette, paletteTop);
  const sidePalette = paletteSide ?? paletteTop;
  const [sideColorA, sideColorB] = getPaletteColors(palette, sidePalette);

  return (
    <ExtendedMaterial
      fragment_top={`varying vec3 vObjectNormal;
uniform sampler2D uTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;
uniform int uChannelSide;
uniform vec3 uBaseColorSide;
uniform vec3 uTexColorSide;
uniform bool uHideTop;`}
      fragment_map={`vec2 new_uv = vUv * 0.0005;
bool is_top = vObjectNormal.z == 1.0 || vObjectNormal.z == -1.0;
if (uHideTop && is_top) discard;
int channel = is_top ? uChannel : uChannelSide; 
float blend_factor = pow(texture2D(uTexture, new_uv)[channel]*texture2D(uTexture, vec2(new_uv.x*-1.618, new_uv.y*1.413))[channel], .5); 
diffuseColor.rgb = is_top ? mix(uBaseColor, uTexColor, blend_factor) : mix(uBaseColorSide, uTexColorSide, blend_factor); 
diffuseColor.a = 1.0;`}
      vertex_top={SHADER_VERTEX_TOP}
      vertex_begin={SHADER_VERTEX_BEGIN}
      uniforms={{
        uTexture: { value: texture },
        uBaseColor: { value: bgrDecimalToRgb(colorA) },
        uTexColor: { value: bgrDecimalToRgb(colorB) },
        uChannel: { value: paletteTop?.channel_index ?? 0 },
        uBaseColorSide: { value: bgrDecimalToRgb(sideColorA) },
        uTexColorSide: { value: bgrDecimalToRgb(sideColorB) },
        uChannelSide: { value: sidePalette?.channel_index ?? 0 },
        uHideTop: { value: clipTop ?? false },
      }}
      doubleSide={doubleSide}
    />
  );
}

export function TexturedShader({ textureName }: { textureName: string }) {
  const otherSpriteTextureName = `sprTex_${textureName}`;
  const textureSpriteName =
    otherSpriteTextureName in SPRITE_INFO_FULL
      ? otherSpriteTextureName
      : textureName in SPRITE_INFO_FULL
        ? textureName
        : "sprWhite";
  const texture = useLoader(
    TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/${textureSpriteName}/0.png`,
  );
  setTextureDefaults(texture);

  return (
    <DefaultMaterial
      map={texture}
      alphaTest={0.1}
      side={DoubleSide}
      transparent
    />
  );
}

export function TexturedColoredShader({
  textureName,
  paletteRef,
  color,
}: {
  textureName: string;
  paletteRef?: PaletteReference;
  color: number;
}) {
  const otherSpriteTextureName = `sprTex_${textureName}`;
  const textureSpriteName =
    otherSpriteTextureName in SPRITE_INFO_FULL
      ? otherSpriteTextureName
      : textureName in SPRITE_INFO_FULL
        ? textureName
        : "sprWhite";
  const texture = useLoader(
    TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/${textureSpriteName}/0.png`,
  );
  const masterTexture = useLoader(
    TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/sprMASTER_TEXTURE/0.png`,
  );
  setTextureDefaults(texture);
  setTextureDefaults(masterTexture);

  const { palette } = useLevelEditor();
  const [colorA, colorB] =
    color == -1 ? getPaletteColors(palette, paletteRef) : [color, color];

  return (
    <ExtendedMaterial
      fragment_top={`uniform sampler2D uTexture;
uniform sampler2D uMasterTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;`}
      fragment_map={`diffuseColor  = texture2D(uTexture, vUv);
if (uBaseColor != vec3(1.0) && uTexColor != vec3(1.0)) {
float blend_factor = texture2D(uMasterTexture, vUv)[uChannel];
vec3 blendColor = mix(uBaseColor, uTexColor, blend_factor);
diffuseColor.rgb = blendColor * diffuseColor.r;
}`}
      uniforms={{
        uTexture: { value: texture },
        uMasterTexture: { value: masterTexture },
        uBaseColor: { value: bgrDecimalToRgb(colorA) },
        uTexColor: { value: bgrDecimalToRgb(colorB) },
        uChannel: { value: color == -1 ? (paletteRef?.channel_index ?? 0) : 0 },
      }}
      alphaTest={0.75}
      doubleSide
      transparent
    />
  );
}

export function MeshColoredShader({
  paletteRef,
}: {
  paletteRef?: PaletteReference;
}) {
  const texture = useLoader(
    TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/sprMASTER_TEXTURE/0.png`,
  );
  setTextureDefaults(texture);

  const { palette } = useLevelEditor();
  const [colorA, colorB] = getPaletteColors(palette, paletteRef);

  return (
    <ExtendedMaterial
      fragment_top={`varying vec3 vObjectPosition;
varying vec3 vObjectNormal;
uniform sampler2D uTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;`}
      fragment_map={`vec2 xUV = (1.0/512.0) * vObjectPosition.yz;
vec2 yUV = (1.0/512.0) * vObjectPosition.xz;
vec2 zUV = (1.0/512.0) * vObjectPosition.xy;
if (vObjectNormal.x < 0.0) xUV.x = -xUV.x;
if (vObjectNormal.y < 0.0) yUV.x = -yUV.x; 
if (vObjectNormal.z < 0.0) zUV.x = -zUV.x; 
vec3 absNormal = abs(vObjectNormal); 
vec3 blendWeight = absNormal / (absNormal.x + absNormal.y + absNormal.z); 
diffuseColor = vec4(0.0, 0.0, 0.0, 1.0);
float blend = blendWeight.x * texture2D(uTexture, xUV)[uChannel]
+ blendWeight.y * texture2D(uTexture, yUV + 0.33)[uChannel]
+ blendWeight.z * texture2D(uTexture, zUV + 0.66)[uChannel];
if (uBaseColor != vec3(0.0) || uTexColor != vec3(0.0)) {
diffuseColor.rgb = mix(uBaseColor, uTexColor, blend);
}`}
      vertex_top={SHADER_VERTEX_TOP}
      vertex_begin={SHADER_VERTEX_BEGIN}
      uniforms={{
        uTexture: { value: texture },
        uBaseColor: { value: bgrDecimalToRgb(colorA) },
        uTexColor: { value: bgrDecimalToRgb(colorB) },
        uChannel: { value: paletteRef?.channel_index ?? 0 },
      }}
      doubleSide
    />
  );
}
