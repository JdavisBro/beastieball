export type TeamBeastie = {
  pid: string;
  specie: string;
  date: number;
  number: string;
  color: number[];
  name: string;
  spr_index: number;
  xp: number;
  scale: number;
  vibe: number;
  ability_index: number;
  // coached
  ba_r: number;
  ha_r: number;
  ma_r: number;
  bd_r: number;
  hd_r: number;
  md_r: number;
  // training
  ba_t: number;
  ha_t: number;
  ma_t: number;
  bd_t: number;
  hd_t: number;
  md_t: number;
  attklist: string[];
};

export type Team = {
  code: string;
  team: TeamBeastie[];
};
