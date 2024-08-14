import item_dic from "./raw/item_dic.json";

export type Item = {
  id: string;
  desc: string;
  value: number;
  points: number;
  img: number;
  type: number;
  name: string;
  eff: number[];
};

const ITEM_DIC: Record<string, Item> = item_dic;

export default ITEM_DIC;
