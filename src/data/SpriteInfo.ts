import sprite_info from "./raw/sprite_info.json";

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Sprite = {
  width: number;
  height: number;
  frames: number;
  bboxes: (BBox | null)[];
  bbox: BBox;
};

const SPRITE_INFO: Record<string, Sprite> = sprite_info;

export default SPRITE_INFO;
