import raw_abilities from "./raw/abilities.json";

const abilities: Record<string, { id: string; name: string; desc: string }> =
  raw_abilities;

export default abilities;
