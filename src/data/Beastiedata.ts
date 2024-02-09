import beastie_data from "./beastie_data.json";
import type { BeastieType } from "./BeastieType";

const BEASTIE_DATA: Map<string, BeastieType> = new Map();

const sorted = Object.entries(beastie_data).sort(
  ([, a], [, b]) => a.number - b.number,
);

for (const [key, value] of sorted) {
  BEASTIE_DATA.set(key, value);
}

export default BEASTIE_DATA;
