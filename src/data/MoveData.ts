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
  DoubleBlock = 15,
}

export type NumberEffect = {
  /* prettier-ignore */
  eff: 
    |0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88
    |-7|-26|-30
  pow: number;
  targ: number;
};

type StringEffect = {
  eff: 89;
  pow: string;
  targ: number;
};

export type MoveEffect = StringEffect | NumberEffect;

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

export const MOVE_DIC: Record<string, Move> = move_dic as Record<string, Move>;

export default MOVE_DIC;
