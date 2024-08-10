import sprite_info from "./raw/sprite_info.json";

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Sprite = {
  name: string;
  width: number;
  height: number;
  frames: number;
  bboxes: BBox[];
  bbox: BBox;
};

const SPRITE_INFO: Array<Sprite | null> = sprite_info;

export default SPRITE_INFO;
