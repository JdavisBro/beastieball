const EffectFilters: {
  name: string;
  effects: Array<number | [number, number]>; // eff | [eff, pow]
}[] = [
  // POW/DEF
  { name: "Body POW", effects: [0, 15] },
  { name: "Body DEF", effects: [3, 16] },
  { name: "Spirit POW", effects: [1, 15] },
  { name: "Spirit DEF", effects: [4, 16] },
  { name: "Mind POW", effects: [2, 15] },
  { name: "Mind DEF", effects: [5, 16] },
  { name: "All POW", effects: [15] },
  { name: "All DEF", effects: [16] },
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
  { name: "Feeling: TENDER", effects: [38] },
  { name: "Feeling: STRESSED", effects: [39] },
  // Field Effects
  { name: "Field: TRAP", effects: [42] },
  { name: "Field: RALLY", effects: [43] },
  { name: "Field: RHYTHM", effects: [44, 64] },
  { name: "Field: DREAD", effects: [45] },
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
  { name: "Additional Damage", effects: [36] },
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
    name: "Condition: STAMINA",
    effects: [
      [33, 0],
      [33, 1],
      [33, 8],
      [33, 9],
    ],
  },
  {
    name: "Condition: TAGGED IN",
    effects: [
      [33, 5],
      [33, 20],
    ],
  },
  {
    name: "Condition: Serve",
    effects: [[33, 7]],
  },
  {
    name: "Condition: Boost",
    effects: [
      [33, 10],
      [33, 11],
      [33, 21],
    ],
  },
  {
    name: "Condition: Bad Feeling",
    effects: [
      [33, 12],
      [33, 13],
    ],
  },
  { name: "Condition: Tied/Behind", effects: [[33, 15]] },
  { name: "Condition: Recieved In Back", effects: [[33, 16]] },
  { name: "Condition: Recieved", effects: [[33, 18]] },
  { name: "Condition: Volley", effects: [[33, 19]] },
];

export default EffectFilters;
