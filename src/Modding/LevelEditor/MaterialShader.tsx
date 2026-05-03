import { useLoader } from "@react-three/fiber";
import { bgrDecimalToRgb } from "../../utils/color";
import { PaletteReference } from "./types";
import { DoubleSide, RepeatWrapping, TextureLoader } from "three";

const SHADER_VERTEX = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const SHADER_FRAGMENT = `
varying vec2 vUv;
varying vec3 vNormal;
uniform bool uUvType;
uniform sampler2D uTexture;
uniform int uChannel;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;
uniform int uChannelSide;
uniform vec3 uBaseColorSide;
uniform vec3 uTexColorSide;
void main(void)
{
  vec2 new_uv = uUvType ? vUv * vUv : vUv * 0.0005;
  bool is_top = vNormal.z > 0.99;
  int channel = is_top ? uChannel : uChannelSide; 
  float blend_factor = pow(texture2D(uTexture, new_uv)[channel]*texture2D(uTexture, vec2(new_uv.x*-1.618, new_uv.y*1.413))[channel], .5); 
  gl_FragColor.rgb = is_top ? mix(uBaseColor, uTexColor, blend_factor) : mix(uBaseColorSide, uTexColorSide, blend_factor); 
  gl_FragColor.a = 1.0;
  // gl_FragColor = vec4(new_uv, 1.0, 1.0);
}
`;

export function MaterialShader({
  paletteTop,
  paletteSide,
  palette,
  doubleSide,
}: {
  palette: number[];
  paletteTop?: PaletteReference;
  paletteSide?: PaletteReference;
  doubleSide?: boolean;
}) {
  const texture = useLoader(
    TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/sprMASTER_TEXTURE/0.png`,
  );
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  const colorA = palette[(paletteTop?.base_index ?? 0) % palette.length];
  const colorB = palette[(paletteTop?.texture_index ?? 1) % palette.length];
  const sidePalette = paletteSide ?? paletteTop;
  const sideColorA = palette[(sidePalette?.base_index ?? 0) % palette.length];
  const sideColorB =
    palette[(sidePalette?.texture_index ?? 1) % palette.length];

  return (
    <shaderMaterial
      fragmentShader={SHADER_FRAGMENT}
      vertexShader={SHADER_VERTEX}
      uniforms={{
        uTexture: { value: texture },
        uBaseColor: { value: bgrDecimalToRgb(colorA) },
        uTexColor: { value: bgrDecimalToRgb(colorB) },
        uChannelTop: { value: paletteTop?.channel_index ?? 0 },
        uBaseColorSide: { value: bgrDecimalToRgb(sideColorA) },
        uTexColorSide: { value: bgrDecimalToRgb(sideColorB) },
        uChannelSide: { value: sidePalette?.channel_index ?? 0 },
        uUvType: { value: doubleSide },
      }}
      side={doubleSide ? DoubleSide : undefined}
    />
  );
}

const SHADER_TEXTURED_FRAGMENT = `
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D uTexture;
uniform vec3 uBaseColor;
uniform vec3 uTexColor;
void main(void)
{
  gl_FragColor = texture2D(uTexture, vUv);
  // gl_FragColor = vec4(vUv, 0.0, 1.0);
}
`;

export function TexturedShader({ textureName }: { textureName: string }) {
  const texture = useLoader(
    TextureLoader,
    `${import.meta.env.VITE_DATA_URL}sprites/${textureName}/0.png`,
  );
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return (
    <shaderMaterial
      fragmentShader={SHADER_TEXTURED_FRAGMENT}
      vertexShader={SHADER_VERTEX}
      uniforms={{
        uTexture: { value: texture },
      }}
      side={DoubleSide}
      transparent
    />
  );
}
