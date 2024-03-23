import beastie_animations from "./beastie_animations.json";

export type BeastieFrames = {
  _: string;
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
  stop?: BeastieAnimation;
  [key: string]: BeastieAnimation | string | number | undefined;
};

export type BeastieAnimList = {
  anim_data?: BeastieAnimData;
  ball: BeastiePos;
  evo1: BeastiePos;
  evo2: BeastiePos;
  evo3: BeastiePos;
  miss: BeastiePos;
  partner: BeastiePos;
  ready: BeastiePos;
  splash: BeastiePos;
  colors: Array<{
    _?: string;
    array: Array<{
      color: number;
      x: number;
    }>;
  }>;
  shiny: Array<{
    _?: string;
    array: Array<{
      color: number;
      x: number;
    }>;
  }>;
};

const BEASTIE_ANIMATIONS: Map<string, BeastieAnimList> = new Map();

Object.keys(beastie_animations).forEach((key) => {
  if (key == "_sprDefaultBeastie") {
    return;
  }
  BEASTIE_ANIMATIONS.set(
    key,
    beastie_animations[key as keyof typeof beastie_animations],
  );
});

export default BEASTIE_ANIMATIONS;
