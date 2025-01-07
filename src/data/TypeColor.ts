import { Type } from "./MoveData";

const TypeColor: Record<string, string> = {
  Body: "#ffdb5e",
  Spirit: "#fb88b0",
  Mind: "#8ddcf5",
  Pass: "#d5dedb",
  Support: "#d5dedb",
  Defence: "#b8c3db",
  Unknown: "#404040",
  Sparkle: "?",
  Movement: "#d5dedb",
  Swap: "#b8c3db",
};

export const TypeData: Record<
  number,
  { color: string; darkColor: string; alt: string }
> = {
  [Type.Body]: {
    color: TypeColor.Body,
    darkColor: "#ffc150",
    alt: "Body Play",
  },
  [Type.Spirit]: {
    color: TypeColor.Spirit,
    darkColor: "#fc6ba8",
    alt: "Spirit Play",
  },
  [Type.Mind]: {
    color: TypeColor.Mind,
    darkColor: "#81c5f9",
    alt: "Mind Play",
  },
  [Type.Volley]: {
    color: TypeColor.Pass,
    darkColor: "#b8c8c5",
    alt: "Volley Play",
  },
  [Type.Support]: {
    color: TypeColor.Support,
    darkColor: "#b8c8c5",
    alt: "Support Play",
  },
  [Type.Defence]: {
    color: TypeColor.Defence,
    darkColor: "#abb1d0",
    alt: "Defence Play",
  },
  [Type.Unknown]: {
    color: TypeColor.Unknown,
    darkColor: "#303030",
    alt: "Unknown",
  },
  [Type.Sparkle]: { color: TypeColor.Sparkle, darkColor: "?", alt: "Unknown" },
  [Type.Movement]: {
    color: TypeColor.Support,
    darkColor: "#b8c8c5",
    alt: "Move Play",
  },
  [Type.Swap]: { color: TypeColor.Defence, darkColor: "#abb1d0", alt: "???" },
};

export default TypeColor;
