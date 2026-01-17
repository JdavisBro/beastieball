import boss_data from "./raw/boss_data.json";

// type ScribbleEffect = {
//   effect: boolean;
//   font_index: number;
//   font_loaded: boolean;
//   font_yoffset: number;
//   ref: {
//     ref: { ref: null };
//     spr: string;
//     sprite_alias: string;
//   };
//   set: number;
//   text: string;
// };

export type Boss = {
  color: number;
  crowd: string[];
  id: string;
  levels: number;
  min_rank: number;
  music: number;
  obj: string | number;
  rank: number;
  scale_rank_start_offset: number;
  title: {
    color: number;
    gender: number;
    // scribbles: ScribbleEffect[] | null;
    wordA: string;
    wordB: string;
  };
};

const BOSS_DATA: Record<string, Boss> = boss_data;

export default BOSS_DATA;
