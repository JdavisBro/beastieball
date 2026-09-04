import spawn_data from "./raw/spawn_data.json";

type SpawnGroup = {
  freq: number;
  percent: number;
  variant: number;
  specie: string;
  lvlA: number;
  lvlB: number;
}[];

export type SpawnInfo = { group?: SpawnGroup; total: number };

const SPAWN_DATA: Record<string, SpawnInfo> = spawn_data;

export default SPAWN_DATA;
