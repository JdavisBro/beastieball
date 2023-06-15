// @flow strict

export enum Type {
  Body = 0,
  Spirit = 1,
  Mind = 2,
  Pass = 3, // ball icon
  Support = 4, // whistle
  Defence = 5,
  Unknown = 6,
  Sparkle = 7, // idk what this one is but the icon is sparkles
  Movement = 8,
  Swap = 9, // tag out is a "defence action" deespite having this icon
  Ice = 10, // idk what this one is either but the icon is ice
}

export type MoveType = {
  name: string,
  desc: string,
  type: Type,
  power: ?number,
}
