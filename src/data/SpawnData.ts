import spawn_data from "./raw/spawn_data.json";

export type SpawnGroup = {
  freq: number;
  percent: number;
  variant: number;
  specie: string;
  lvlA: number;
  lvlB: number;
}[];

const SPAWN_DATA: {
  [key: string]: {
    group: SpawnGroup | undefined;
  };
} = spawn_data;

export default SPAWN_DATA;
