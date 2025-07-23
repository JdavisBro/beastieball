import encounter_data from "./raw/encounter_data.json";

type Ai = {
  actions: number;
  blocking: number;
  boost: number;
  damage: number;
  erratic: number;
  fall: number;
  field: number;
  foe_boost: number;
  foe_field: number;
  foe_status: number;
  force: number;
  knockout: number;
  lane: number;
  lane_cover: number;
  lane_prediction: number;
  lane_sideways_fear: number;
  lane_straight_fear: number;
  meter: number;
  point: number;
  prediction: number;
  prefer_target: number;
  secondary: number | boolean;
  stamina: number;
  status: number;
  tag_penalty: number;
  usable_attack: number;
};

export type EncounterBeastie = {
  ability?: number;
  aggro?: boolean;
  at_net?: boolean;
  canBeShiny?: boolean;
  color?: number | number[];
  encounter_inherited?: boolean;
  evolves?: boolean;
  favor?: number;
  from_encounter?: null | string;
  from_encounter_index?: null | number;
  hp?: number;
  level: number;
  moves?: (string | string[])[];
  name?: string;
  neverRandomize?: boolean;
  number?: string | number;
  size?: number;
  specie: string;
  status?: number | number[];
  trained?: number; // training points used trained * 240
  training?: number[]; // distribution of used stats invested, ba ha ma, bd hd md
  variant?: number;
  vibe?: number;
};

export type Encounter = {
  ai: Ai;
  id: string;
  scales: string | boolean | number;
  team: EncounterBeastie[];
};

export type EncounterDataType = Record<string, Encounter>;

const ENCOUNTER_DATA: EncounterDataType = encounter_data;

export default ENCOUNTER_DATA;
