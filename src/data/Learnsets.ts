import learnsets from "./raw/learnsets.json";

const LEARN_SETS: Record<number, Array<[string, number]>> = {};
Object.keys(learnsets).forEach(
  (key) =>
    (LEARN_SETS[Number(key)] = learnsets[
      key as keyof typeof learnsets
    ] as Array<[string, number]>),
);

export default LEARN_SETS;
