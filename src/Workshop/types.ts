import { MoveEffect } from "../data/MoveData";

export type WorkshopData = {
  // [general]
  name: string;
  description: string;
  author: string;
  url: string;
  major_version: string;
  minor_version: string;
  internal_id: string;
  finished: string;

  // my stuff
  plays: WorkshopPlay[];
  music: WorkshopMusic[];
  beasties: WorkshopBeastie[];
};

export type WorkshopPlay = {
  // [basic]
  name: string;
  type: number;
  pow: number;
  use: number;
  target: number;
  // [effects]
  effects: MoveEffect[]; // , joined - eff,targ,pow
  // [distribution]
  learnedby: string[]; // , joined
};

export type WorkshopMusic = {
  // [general]
  name: string;
  bpm: number;
  intro_length: number;
};

type WorkshopBeastieSet = {
  trait: number;
  plays: [string, string, string];
  bp: number;
  sp: number;
  mp: number;
  bd: number;
  sd: number;
  md: number;
};

export type WorkshopBeastie = {
  // [basic]
  reskins: string;
  name: string;
  description: string;
  metamorphs: [string, number] | undefined;
  // [display]
  palette_count: 0 | 1 | 2;
  scale_min: number;
  scale_max: number;
  face_color_index: number;
  body_color_index: number;
  linked_color_slots: [number, number][] | undefined; // , joined
  // [stats]
  trait: string;
  trait_recessive: boolean;
  trait_names: string | undefined;
  bp: number;
  sp: number;
  mp: number;
  bd: number;
  sd: number;
  md: number;
  ally_training: [string, number][];
  // [playbook]
  plays_level: [number, string][];
  plays_extra: string[];
  // [combos]
  combo_rival: MoveEffect[];
  combo_partner: MoveEffect[];
  combo_sweetheart: MoveEffect[];
  combo_bestie: MoveEffect[];
  // [extra]
  recruit_condition: string;
  rarity: number;
  growth_rate: number;
  size: number;
  foot_type: 0 | 1 | 2;
  eat_type: 0 | 1 | 2 | 3 | 4;
  // [spawn]
  quick_recruit: boolean;
  spawn_locations: [string, number, number, number][]; // id, min lvl, max lvl, weight - , joined
  overworld_type: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  // [sets]
  set1: WorkshopBeastieSet;
  set2: WorkshopBeastieSet;
  set3: WorkshopBeastieSet;
  set4: WorkshopBeastieSet;
  set5: WorkshopBeastieSet;
  set6: WorkshopBeastieSet;
};
