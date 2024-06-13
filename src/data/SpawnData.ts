import spawn_data from "./spawn_data.json";

const SPAWN_DATA: {
  [key: string]: {
    group:
      | {
          freq: number;
          percent: number;
          variant: number;
          specie: string;
          lvlA: number;
          lvlB: number;
        }[]
      | undefined;
  };
} = spawn_data;

export default SPAWN_DATA;
