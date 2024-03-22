import sprite_info from "./sprite_info.json";

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

const SPRITE_INFO: Sprite[] = sprite_info;

export default SPRITE_INFO;
