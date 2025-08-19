import move_dic from "./raw/move_dic.json";

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
