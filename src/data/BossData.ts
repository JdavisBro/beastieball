import boss_data from "./raw/boss_data.json";

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
    wordA: string;
    wordB: string;
  };
};

const BOSS_DATA: Record<string, Boss> = boss_data;

export default BOSS_DATA;
