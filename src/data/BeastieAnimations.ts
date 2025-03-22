import beastie_animations from "./raw/beastie_animations.json";

export type BeastieFrames = {
  _: string;
  bpm?: number;
  startFrame?: number;
  endFrame?: number;
  holds?: {
    _: string;
    [index: string]: number | number[] | string | undefined; // has to be either or the class thing will make error...
  };
  sounds?: { _: string; [index: string]: number | string | undefined };
  transitions?: number[];
};

export type BeastieAnimation = {
  _: string;
  frames: BeastieFrames | BeastieFrames[];
  speed?: number;
  loop?: string[];
};

export type BeastiePos = {
  angle?: number;
  anim?: string;
  scale?: number;
  x: number;
  y: number;
};

export type BeastieAnimData = {
  _: string;
  __anim_speed?: number;
  bad: BeastieAnimation;
  fall: BeastieAnimation;
  good: BeastieAnimation;
  idle: BeastieAnimation;
  move: BeastieAnimation;
  ready: BeastieAnimation;
  spike: BeastieAnimation;
  volley: BeastieAnimation;
  air?: BeastieAnimation;
  stop?: BeastieAnimation;
  menu: BeastieAnimation;
  [key: string]: BeastieAnimation | string | number | undefined;
};

export type Circular = { __Elephant_Circular_Ref__: number };

export type BeastieAnimList = {
  anim_data: BeastieAnimData | Circular;
  ball: BeastiePos;
  evo1: BeastiePos;
  evo2: BeastiePos;
  evo3: BeastiePos;
  miss: BeastiePos;
  partner: BeastiePos;
  ready: BeastiePos;
  splash: BeastiePos;
  colors:
    | Array<{
        _?: string;
        array: Array<{
          color: number;
          x: number;
        }>;
      }>
    | Circular;
  colors2:
    | Array<{
        _?: string;
        array: Array<{
          color: number;
          x: number;
        }>;
      }>
    | null
    | Circular;
  shiny:
    | Array<{
        _?: string;
        array: Array<{
          color: number;
          x: number;
        }>;
      }>
    | Circular;
};

const BEASTIE_ANIMATIONS: Map<string, BeastieAnimList> = new Map();

Object.keys(beastie_animations).forEach((key) => {
  const anims = beastie_animations[key as keyof typeof beastie_animations];
  if (key == "_sprDefaultBeastie" || !("anim_data" in anims)) {
    return;
  }
  BEASTIE_ANIMATIONS.set(key, anims);
});

export default BEASTIE_ANIMATIONS;
