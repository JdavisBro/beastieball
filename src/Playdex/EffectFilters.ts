const EffectFilters: {
  name: string;
  effects?: Array<number | [number, number]>; // eff | [eff, pow]
  use?: Array<number>;
  target?: Array<number>;
  placeholderKey?: string;
}[] = [
  // POW/DEF
  { name: "common.types.bodyPow", effects: [0, 15, 74, 75] },
  { name: "common.types.bodyDef", effects: [3, 16, 77, 78] },
  { name: "common.types.spiritPow", effects: [1, 15, 74, 76] },
  { name: "common.types.spiritDef", effects: [4, 16, 77, 79] },
  { name: "common.types.mindPow", effects: [2, 15, 75, 76] },
  { name: "common.types.mindDef", effects: [5, 16, 78, 79] },
  { name: "allPow", effects: [15] },
  { name: "allDef", effects: [16] },
  // Use Conditions
  { name: "useFromBack", use: [1] },
  { name: "useFromNet", use: [2] },
  { name: "useBallHittable", effects: [69] },
  // Targets
  { name: "targetStraight", target: [1, 3] },
  { name: "targetFront", target: [4] },
  { name: "targetBack", target: [8] },
  { name: "targetSideways", target: [12] },
  { name: "targetNearest", target: [13] },
  // FEELINGS
  {
    name: "feeling",
    placeholderKey: "statuseffectstuff_001",
    effects: [6, [33, 12]],
  },
  { name: "feeling", placeholderKey: "statuseffectstuff_002", effects: [12] },
  {
    name: "feeling",
    placeholderKey: "statuseffectstuff_003",
    effects: [13, 61],
  },
  { name: "feeling", placeholderKey: "statuseffectstuff_004", effects: [14] },
  { name: "feeling", placeholderKey: "statuseffectstuff_005", effects: [19] },
  { name: "feeling", placeholderKey: "statuseffectstuff_006", effects: [22] },
  {
    name: "feeling",
    placeholderKey: "statuseffectstuff_007",
    effects: [23, [33, 12]],
  },
  { name: "feeling", placeholderKey: "statuseffectstuff_009", effects: [26] }, // JAZZED
  { name: "feeling", placeholderKey: "statuseffectstuff_010", effects: [27] },
  { name: "feeling", placeholderKey: "statuseffectstuff_011", effects: [29] },
  {
    name: "feeling",
    placeholderKey: "statuseffectstuff_012",
    effects: [38, [33, 12]],
  },
  { name: "feeling", placeholderKey: "statuseffectstuff_013", effects: [39] },
  // Field Effects
  {
    name: "field",
    placeholderKey: "fieldeffectstuff_001",
    effects: [43, [33, 25]],
  },
  { name: "field", placeholderKey: "fieldeffectstuff_002", effects: [42] },
  { name: "field", placeholderKey: "fieldeffectstuff_003", effects: [44, 64] },
  { name: "field", placeholderKey: "fieldeffectstuff_004", effects: [45] },
  { name: "field", placeholderKey: "fieldeffectstuff_005", effects: [70] },
  // Other
  { name: "move", effects: [7] },
  { name: "switch", effects: [11, 28] },
  { name: "healDamage", effects: [8] },
  { name: "volleyTake", effects: [20] },
  { name: "hitWithoutVolleying", effects: [17] },
  { name: "easyReceive", effects: [18] },
  { name: "tagOut", effects: [30] },
  { name: "transferBoosts", effects: [31] },
  { name: "clearFeelings", effects: [32, 34] },
  { name: "restore", effects: [47] },
  { name: "clearField", effects: [46] },
  {
    name: "ignore",
    effects: [[33, 14], [33, 17], 61],
  },
  // { name: "Additional Damage", effects: [36] },
  { name: "addActions", effects: [10] },
  { name: "requiresActions", effects: [40, 41] },
  { name: "wall", effects: [56] },
  { name: "swapTrait", effects: [63] },
  {
    name: "basedOnDef",
    effects: [
      [33, 22],
      [33, 23],
    ],
  },
  // Conditional Boosts
  {
    name: "powStamina",
    effects: [
      [33, 0],
      [33, 1],
      [33, 8],
      [33, 27],
    ],
  },
  {
    name: "powTag",
    effects: [
      [33, 5],
      [33, 20],
    ],
  },
  {
    name: "powServe",
    effects: [[33, 7]],
  },
  {
    name: "powBoost",
    effects: [
      [33, 10],
      [33, 11],
      [33, 21],
    ],
  },
  {
    name: "powFeeling",
    effects: [
      [33, 12],
      [33, 13],
    ],
  },
  { name: "powPoints", effects: [[33, 15]] },
  { name: "powBack", effects: [[33, 16]] },
  { name: "powRecieved", effects: [[33, 18]] },
  { name: "powVolley", effects: [[33, 19]] },
  { name: "powMoved", effects: [[33, 26]] },
];

export default EffectFilters;
