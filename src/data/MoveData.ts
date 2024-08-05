import move_dic from "./move_dic.json";

export enum Origin { // For sorting, currently this is not added to the moves.
  Net = 0,
  Back = 1,
  Any = 2,
}

export enum Target {
  Sideways = 0,
  Back = 1,
  Front = 2,
  Current = 3, // "my lane"
  Any = 4,
}

export enum Effect {
  None = 0,
  Jazzed = 1,
  Tough = 2,
  Blocked = 3,
  Noisy = 4,
  Nervous = 5,
  Angry = 6,
  Shook = 7,
  Tender = 8,
  Stressed = 9,
  Tired = 10,
  Sweaty = 11,
  Wiped = 12,
  BodyAtk = 13,
  SpiritAtk = 14,
  MindAtk = 15,
  BodyDef = 16,
  SpiritDef = 17,
  MindDef = 18,
  Shift = 19,
  Stamina = 20, // change stamina, heal / -stamina
  Other = 21,
}

export enum Type {
  Body = 0,
  Spirit = 1, // aka h/heart
  Mind = 2,
  Volley = 3, // ball icon
  Support = 4, // whistle
  Defence = 5,
  Unknown = 6,
  Sparkle = 7, // idk what this one is but the icon is sparkles
  Movement = 8,
  Swap = 9, // tag out is a "defence action" deespite having this icon
  Ice = 10, // idk what this one is either but the icon is ice
}

export type MoveEffect = {
  pow: number;
  eff: number;
  targ: number;
};

export type Move = {
  id: string;
  targ: number;
  desc_tagids: number[];
  description: null;
  bt_tags: number[];
  eff: MoveEffect[];
  use: number;
  type: Type;
  desc_tags: number[];
  pow: number;
  name: string;
};

export const MOVE_DIC: {
  [key: string]: Move;
} = move_dic;

export default MOVE_DIC;
