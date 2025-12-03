const EffectFilters: {
  name: string;
  effects?: Array<number | [number, number]>; // eff | [eff, pow]
  use?: Array<number>;
  target?: Array<number>;
}[] = [
  // POW/DEF
  { name: "Body POW", effects: [0, 15, 74, 75] },
  { name: "Body DEF", effects: [3, 16, 77, 78] },
  { name: "Spirit POW", effects: [1, 15, 74, 76] },
  { name: "Spirit DEF", effects: [4, 16, 77, 79] },
  { name: "Mind POW", effects: [2, 15, 75, 76] },
  { name: "Mind DEF", effects: [5, 16, 78, 79] },
  { name: "All POW", effects: [15] },
  { name: "All DEF", effects: [16] },
  // Use Conditions
  { name: "Usage Condition: From Back", use: [1] },
  { name: "Usage Condition: At Net", use: [2] },
  { name: "Usage Condition: Ball Hittable", effects: [69] },
  // Targets
  { name: "Targets: Straight Ahead", target: [1, 3] },
  { name: "Targets: Front Row", target: [4] },
  { name: "Targets: Back Row", target: [8] },
  { name: "Targets: Sideways", target: [12] },
  { name: "Targets: Nearest Opponent", target: [13] },
  // FEELINGS
  { name: "Feeling: NERVOUS", effects: [6, [33, 12]] },
  { name: "Feeling: ANGRY", effects: [12] },
  { name: "Feeling: SHOOK", effects: [13, 61] },
  { name: "Feeling: NOISY", effects: [14] },
  { name: "Feeling: TOUGH", effects: [19] },
  { name: "Feeling: WIPED", effects: [22] },
  { name: "Feeling: SWEATY", effects: [23, [33, 12]] },
  { name: "Feeling: JAZZED", effects: [26] },
  { name: "Feeling: BLOCKED", effects: [27] },
  { name: "Feeling: TIRED", effects: [29] },
  { name: "Feeling: TENDER", effects: [38, [33, 12]] },
  { name: "Feeling: STRESSED", effects: [39] },
  { name: "Feeling: WEEPY", effects: [80, [33, 12]] },
  // Field Effects
  { name: "Field: TRAP", effects: [42] },
  { name: "Field: RALLY", effects: [43, [33, 25]] },
  { name: "Field: RHYTHM", effects: [44, 64] },
  { name: "Field: DREAD", effects: [45] },
  { name: "Field: QUAKE", effects: [70] },
  // Other
  { name: "Shift/Move", effects: [7] },
  { name: "Switch Places", effects: [11, 28] },
  { name: "Heal/Direct Damage", effects: [8] },
  { name: "Volley Ball/Take Ball", effects: [20] },
  { name: "Hit Without Volley", effects: [17] },
  { name: "Easy Recieve", effects: [18] },
  { name: "TAG OUT", effects: [30] },
  { name: "Transfer Boosts", effects: [31] },
  { name: "Clear Feelings", effects: [32, 34] },
  { name: "Restore Stamina and Feelings", effects: [47] },
  { name: "Clear Field", effects: [46] },
  {
    name: "Ignores Shields/Boosts/Feelings",
    effects: [[33, 14], [33, 17], 61],
  },
  // { name: "Additional Damage", effects: [36] },
  { name: "Add Actions", effects: [10] },
  { name: "Requires More Actions", effects: [40, 41] },
  { name: "Wall", effects: [56] },
  { name: "Swap Traits", effects: [63] },
  {
    name: "Based on Target DEF",
    effects: [
      [33, 22],
      [33, 23],
    ],
  },
  // Conditional Boosts
  {
    name: "Pow Condition: STAMINA",
    effects: [
      [33, 0],
      [33, 1],
      [33, 8],
      [33, 27],
    ],
  },
  {
    name: "Pow Condition: TAGGED IN",
    effects: [
      [33, 5],
      [33, 20],
    ],
  },
  {
    name: "Pow Condition: Serve",
    effects: [[33, 7]],
  },
  {
    name: "Pow Condition: Boost",
    effects: [
      [33, 10],
      [33, 11],
      [33, 21],
    ],
  },
  {
    name: "Pow Condition: Bad Feeling",
    effects: [
      [33, 12],
      [33, 13],
    ],
  },
  { name: "Pow Condition: Tied/Behind", effects: [[33, 15]] },
  { name: "Pow Condition: Back-row Target", effects: [[33, 16]] },
  { name: "Pow Condition: Recieved", effects: [[33, 18]] },
  { name: "Pow Condition: Volley", effects: [[33, 19]] },
  { name: "Pow Condition: Changed Row/Lane", effects: [[33, 26]] },
];

export default EffectFilters;
