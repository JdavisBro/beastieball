import move_dic from "./raw/move_dic.json";

export enum Type {
  Body = 0,
  Spirit = 1, // aka h/heart
  Mind = 2,
  Volley = 3, // ball icon
  Support = 4, // whistle
  Defence = 5,
  Unknown = 6,
  Sparkle = 7, // idk what this one is but the icon is sparkles
  Movement = 8,
  Swap = 9, // tag out is a "defence action" deespite having this icon
  Ice = 10, // idk what this one is either but the icon is ice
  DoubleBlock = 15,
}

export enum FeelingType {
  Nervous,
  Angry,
  Shook,
  Noisy,
  Tough,
  Wiped,
  Sweaty,
  Aware,
  Jazzed,
  Blocked,
  Tired,
  Tender,
  Stressed,
  Weepy,
}

export enum MoveEffectType {
  // Boosts
  BodyPowChange = 0,
  SpiritPowChange = 1,
  MindPowChange = 2,
  BodyDefChange = 3,
  SpiritDefChange = 4,
  MindDefChange = 5,
  BodySpiritPowChange = 74,
  BodyMindPowChange = 75,
  SpiritMindPowChange = 76,
  BodySpiritDefChange = 77,
  BodyMindDefChange = 78,
  SpiritMindDefChange = 79,
  AllPowChange = 15,
  AllDefChange = 16,
  WeakDefChange = 93,
  TransferBoosts = 31,
  ResetBoosts = 34,
  // Feelings
  FeelNervous = 6,
  FeelAngry = 12,
  FeelShook = 13,
  FeelNoisy = 14,
  FeelTough = 19,
  FeelWiped = 22,
  FeelSweaty = 23,
  FeelAware = 25,
  FeelJazzed = 26,
  FeelBlocked = 27,
  FeelTired = 29,
  FeelTender = 38,
  FeelStressed = 39,
  FeelWeepy = 80,

  FeelNervousBeforeHit = -6,
  FeelAngryBeforeHit = -12,
  FeelShookBeforeHit = -13,
  FeelNoisyBeforeHit = -14,
  FeelToughBeforeHit = -19,
  FeelWipedBeforeHit = -22,
  FeelSweatyBeforeHit = -23,
  FeelAwareBeforeHit = -25,
  FeelJazzedBeforeHit = -26,
  FeelBlockedBeforeHit = -27,
  FeelTiredBeforeHit = -29,
  FeelTenderBeforeHit = -38,
  FeelStressedBeforeHit = -39,
  FeelWeepyPlus = -80,

  FeelingCombiner = 53,
  FeelingCure = 95,
  FeelingBadCure = 52,
  FeelingAllCure = 32,
  FeelingAllCureAngry = 94,
  // Field
  FieldTrap = 42,
  FieldRally = 43,
  FieldRhythm = 44,
  FieldDread = 45,
  FieldQuake = 70,
  FieldBarrier = 56,
  FieldClear = 46,
  // Stamina
  StaminaChange = 8,
  MaxStaminaChange = 82,
  FullRestore = 47,
  StaminaSplit = 92,
  // Move
  Shift = 7,
  ShiftBeforeHit = -7,
  Swap = 11,
  SwapNoBall = 28,
  TagOut = 30,
  TagOutBeforeHit = -30,
  // Trait
  TraitSwap = 63,
  TraitCopy = 65,
  TraitGive = 81,
  TraitSet = 89, // STRING
  // Attack
  DamageAdjust = 33,
  CanHitWithoutVolley = 17,
  GivesEasyRecieve = 18,
  VolleyOnRecieve = 71,
  NoRedirect = 73,
  UseWhenPreventFeeling = 61,
  IgnoresTrait = 91,
  Mimic = 83,
  PowMultiply = 84,
  // Usage
  Pass = 20,
  Charge = 86,
  ChargeReset = 87,
  AddActions = 10,
  Requires2Actions = 40,
  Requires3Actions = 41,
  PreventObstructed = 57,
  CanUseDefense = 67,
  RequiredVolleyState = 69,
  // Effect Conditions
  IfHittable = 72,
  IfSuccess = 90,
  IfBlock = 85,
  IfField = 64,
  IfStamina = 88,
  IfFeeling = 96,
  // Unused
  AdditionalPercent = 36,
  // Other
  Rowdy = 60,
  // Combo
  ComboTarget = 49,
  ComboPow = 50,
  ComboUse = 51,
  ComboType = 62,
}

type StringEffectType = MoveEffectType.TraitSet;

export type NumberEffect = {
  eff: Exclude<MoveEffectType, StringEffectType>;
  pow: number;
  targ: number;
};

/* prettier-ignore */
type StringEffect = {
  eff: StringEffectType;
  pow: string;
  targ: number;
};

export type MoveEffect = StringEffect | NumberEffect;

export type Move = {
  id: string;
  targ: number;
  desc_tagids: number[];
  description: null;
  bt_tags: number[];
  eff: MoveEffect[];
  use: number;
  type: Type;
  desc_tags: number[];
  pow: number;
  name: string;
  price: number;
};

export const MOVE_DIC: Record<string, Move> = move_dic as Record<string, Move>;

export default MOVE_DIC;
