import BEASTIE_DATA, { BeastieType } from "../../data/BeastieData";

const LEVEL_METAMORPHS = [0, 4, 9, 10, 11];

export default function getMetamorphAtLevel(
  beastie: BeastieType,
  level: number,
  splitPrefer: string,
  return_self: boolean = false,
): null | BeastieType {
  if (!beastie.evolution) {
    return return_self ? beastie : null;
  }
  const levelMetamorphs = beastie.evolution.filter((evo) =>
    evo.condition.some((cond) => LEVEL_METAMORPHS.includes(cond)),
  );
  if (!levelMetamorphs.length) {
    return return_self ? beastie : null;
  }
  const possibleLevelMetamorphs = levelMetamorphs.filter(
    (evo) => typeof evo.value[0] == "number" && evo.value[0] <= level,
  );
  if (!possibleLevelMetamorphs.length) {
    return beastie;
  }
  const evo =
    possibleLevelMetamorphs.find((evo) => evo.specie == splitPrefer) ??
    possibleLevelMetamorphs[0];
  const evo_beastie = BEASTIE_DATA.get(evo.specie);
  if (!evo_beastie) {
    return null;
  }
  if (!evo_beastie.evolution) {
    return evo_beastie;
  }
  return getMetamorphAtLevel(
    evo_beastie,
    level,
    splitPrefer,
    beastie.id == splitPrefer || return_self,
  );
}
