import { RepeatWrapping, Texture } from "three";

export default function setTextureDefaults(texture: Texture) {
  // texture.magFilter = NearestFilter; // lags for some reason...
  // texture.minFilter = NearestFilter;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
}
