import { DoubleSide, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

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

const SHADER_VERTEX = `
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vPosition = position * 230.0;
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const SHADER_FRAGMENT = `
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D uTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;
uniform int uChannelSide;
uniform vec3 uBaseColorSide;
uniform vec3 uTexColorSide;
uniform bool uHideTop;
void main(void)
{
  vec2 new_uv = vUv * 0.0005;
  bool is_top = vNormal.z == 1.0 || vNormal.z == -1.0;
  if (uHideTop && is_top) discard;
  int channel = is_top ? uChannel : uChannelSide; 
  float blend_factor = pow(texture2D(uTexture, new_uv)[channel]*texture2D(uTexture, vec2(new_uv.x*-1.618, new_uv.y*1.413))[channel], .5); 
  gl_FragColor.rgb = is_top ? mix(uBaseColor, uTexColor, blend_factor) : mix(uBaseColorSide, uTexColorSide, blend_factor); 
  gl_FragColor.a = 1.0;
}
`;

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
    <shaderMaterial
      fragmentShader={SHADER_FRAGMENT}
      vertexShader={SHADER_VERTEX}
      uniforms={{
        uTexture: { value: texture },
        uBaseColor: { value: bgrDecimalToRgb(colorA) },
        uTexColor: { value: bgrDecimalToRgb(colorB) },
        uChannel: { value: paletteTop?.channel_index ?? 0 },
        uBaseColorSide: { value: bgrDecimalToRgb(sideColorA) },
        uTexColorSide: { value: bgrDecimalToRgb(sideColorB) },
        uChannelSide: { value: sidePalette?.channel_index ?? 0 },
        uHideTop: { value: clipTop },
      }}
      side={doubleSide ? DoubleSide : undefined}
    />
  );
}

// const SHADER_TEXTURED_FRAGMENT = `
// varying vec2 vUv;
// uniform sampler2D uTexture;
// void main(void)
// {
//   gl_FragColor = texture2D(uTexture, vUv);
// }
// `;

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

  return <meshPhongMaterial map={texture} side={DoubleSide} transparent />;
}

const SHADER_TEXTURED_COLORED_FRAGMENT = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uMasterTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;
void main(void)
{
  gl_FragColor = texture2D(uTexture, vUv);
  if (uBaseColor != vec3(1.0) && uTexColor != vec3(1.0)) {
    float blend_factor = texture2D(uMasterTexture, vUv)[uChannel];
    vec3 blendColor = mix(uBaseColor, uTexColor, blend_factor);
    gl_FragColor.rgb = blendColor * gl_FragColor.r;
  }
}
`;

export function TexturedColoredShader({
  textureName,
  paletteRef,
}: {
  textureName: string;
  paletteRef?: PaletteReference;
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
  const [colorA, colorB] = getPaletteColors(palette, paletteRef);

  return (
    <shaderMaterial
      fragmentShader={SHADER_TEXTURED_COLORED_FRAGMENT}
      vertexShader={SHADER_VERTEX}
      uniforms={{
        uTexture: { value: texture },
        uMasterTexture: { value: masterTexture },
        uBaseColor: { value: bgrDecimalToRgb(colorA) },
        uTexColor: { value: bgrDecimalToRgb(colorB) },
        uChannel: { value: paletteRef?.channel_index ?? 0 },
      }}
      side={DoubleSide}
      transparent
    />
  );
}

const SHADER_MESH_COLORED_FRAGMENT = `
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D uTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;
void main(void)
{
  vec2 xUV = (1.0/512.0) * vPosition.yz;
  vec2 yUV = (1.0/512.0) * vPosition.xz;
  vec2 zUV = (1.0/512.0) * vPosition.xy;
  if (vNormal.x < 0.0) xUV.x = -xUV.x;
	if (vNormal.y < 0.0) yUV.x = -yUV.x; 
	if (vNormal.z < 0.0) zUV.x = -zUV.x; 
  vec3 absNormal = abs(vNormal); 
	vec3 blendWeight = absNormal / (absNormal.x + absNormal.y + absNormal.z); 
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  float blend = blendWeight.x * texture2D(uTexture, xUV)[uChannel]
    + blendWeight.y * texture2D(uTexture, yUV + 0.33)[uChannel]
    + blendWeight.z * texture2D(uTexture, zUV + 0.66)[uChannel];
  if (uBaseColor != vec3(0.0) || uTexColor != vec3(0.0)) {
    gl_FragColor.rgb = mix(uBaseColor, uTexColor, blend);
  }
}
`;

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
    <shaderMaterial
      fragmentShader={SHADER_MESH_COLORED_FRAGMENT}
      vertexShader={SHADER_VERTEX}
      uniforms={{
        uTexture: { value: texture },
        uBaseColor: { value: bgrDecimalToRgb(colorA) },
        uTexColor: { value: bgrDecimalToRgb(colorB) },
        uChannel: { value: paletteRef?.channel_index ?? 0 },
      }}
      side={DoubleSide}
    />
  );
}
