import sprite_info from "./sprite_info.json";

export type Sprite = {
  name: string;
  width: number;
  height: number;
};

const SPRITE_INFO: Sprite[] = sprite_info;

export default SPRITE_INFO;
