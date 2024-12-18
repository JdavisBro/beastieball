import raw_abilities from "./raw/abilities.json";

export type Ability = { id: string; name: string; desc: string };

const abilities: Record<string, Ability> = raw_abilities;

export default abilities;
