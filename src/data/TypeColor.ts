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
  Ice: "??",
};

export const TypeData: Record<number, { color: string; alt: string }> = {
  [Type.Body]: { color: TypeColor.Body, alt: "Body Play" },
  [Type.Spirit]: { color: TypeColor.Spirit, alt: "Spirit Play" },
  [Type.Mind]: { color: TypeColor.Mind, alt: "Mind Play" },
  [Type.Volley]: { color: TypeColor.Pass, alt: "Volley Play" },
  [Type.Support]: { color: TypeColor.Support, alt: "Support Play" },
  [Type.Defence]: { color: TypeColor.Defence, alt: "Defence Play" },
  [Type.Unknown]: { color: TypeColor.Unknown, alt: "Unknown" },
  [Type.Sparkle]: { color: TypeColor.Sparkle, alt: "Unknown" },
  [Type.Movement]: { color: TypeColor.Movement, alt: "Move Play" },
  [Type.Swap]: { color: "#ffffff", alt: "???" },
};

export default TypeColor;
