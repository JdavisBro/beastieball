import { EncounterBeastie } from "../../data/EncounterData";
import styles from "./Encounters.module.css";
import BEASTIE_DATA from "../../data/BeastieData";
import Beastie from "../Beastie/Beastie";
import { createPid } from "../Builder/createBeastie";
import getMoveset from "./getMoveset";
import getMetamorphAtLevel from "./getMetamorphAtLevel";
import Randomizer from "../../utils/Randomizer";
import { useMemo } from "react";
import useLocalization from "../../localization/useLocalization";

function hashCode(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash += text.charCodeAt(i);
    hash *= 691;
    hash = hash % 4294967296;
  }
  return hash;
}

export default function EncounterBeastieElem({
  encounterId,
  encBeastie,
  index,
  bonus_levels,
}: {
  encounterId: string;
  encBeastie: EncounterBeastie;
  index: number;
  bonus_levels: number;
}) {
  const { L } = useLocalization();

  const level = encBeastie.level + Math.floor(bonus_levels);

  const pid = useMemo(createPid, [encounterId]);

  const beastieDataPre = BEASTIE_DATA.get(encBeastie.specie || "shroom1");
  if (!beastieDataPre) {
    return null;
  }
  const beastieFamily = BEASTIE_DATA.get(beastieDataPre.family);
  if (!beastieFamily) {
    return null;
  }
  const beastieData =
    getMetamorphAtLevel(beastieFamily, level, beastieDataPre.id) ??
    beastieDataPre;

  const fromEncounter = encBeastie.from_encounter ?? encounterId;
  const fromEncounterIndex = encBeastie.from_encounter_index ?? index;

  const randomizer = new Randomizer(1);
  randomizer.randomizer_seed(hashCode(fromEncounter) + fromEncounterIndex);
  randomizer.spam_random(9);
  const random_ability = Math.floor(
    randomizer.random(beastieData.ability.length),
  );
  const random_colors = new Array(beastieData.colors.length)
    .fill(0.5)
    .map(() => randomizer.random());
  let ibisIndex = 0;
  if (beastieData.id == "ibis") {
    randomizer.spam_random(4);
    ibisIndex = Math.min(Math.max(Math.floor(randomizer.random(3)) / 2, 0), 1);
  }
  let randomSprite = 0;
  if (beastieData.palettes > 1 && randomizer.random(1) < 0.1) {
    randomSprite = 2;
  }

  const variant =
    encBeastie.variant !== undefined && encBeastie.variant != -1
      ? encBeastie.variant
      : randomSprite;
  const color = Array.isArray(encBeastie.color)
    ? encBeastie.color
    : random_colors.map((c) => (c += variant));
  const spr_index =
    beastieData.id == "ibis"
      ? ibisIndex
      : beastieData.id != "crab" && beastieData.spr_alt.length
        ? Math.floor(
            Math.sqrt(randomizer.random() ^ 2) *
              (beastieData.spr_alt.length + 1),
          )
        : 0;

  const ability_index =
    encBeastie.ability !== undefined && encBeastie.ability != -1
      ? encBeastie.ability
      : beastieData.ability_hidden || beastieData.ability.length == 1
        ? 0
        : random_ability;

  const training = {
    ba_t: 0,
    ha_t: 0,
    ma_t: 0,
    bd_t: 0,
    hd_t: 0,
    md_t: 0,
  };
  if (
    encBeastie.trained &&
    encBeastie.trained > 0 &&
    Array.isArray(encBeastie.training)
  ) {
    const total_points = Math.round(240 * encBeastie.trained);
    const total_alloc = encBeastie.training.reduce((p, n) => p + n);
    const getStat = (num: number) =>
      Math.min(120, Math.round((total_points * num) / total_alloc));
    training.ba_t = getStat(encBeastie.training[0]);
    training.ha_t = getStat(encBeastie.training[1]);
    training.ma_t = getStat(encBeastie.training[2]);
    training.bd_t = getStat(encBeastie.training[3]);
    training.hd_t = getStat(encBeastie.training[4]);
    training.md_t = getStat(encBeastie.training[5]);
  }

  return (
    <div className={styles.beastieContainer}>
      <Beastie
        teamBeastie={{
          pid: pid,
          specie: beastieData.id,
          date: 1,
          number: (encBeastie.number &&
          (typeof encBeastie.number == "string" || encBeastie.number > -1)
            ? String(encBeastie.number)
            : String(index + 1)
          ).padStart(2, "0"),
          color: color,
          name: L(encBeastie.name ?? ""),
          spr_index: spr_index,
          xp: level ** 3 * beastieData.growth,
          scale: encBeastie.size && encBeastie.size > 0 ? encBeastie.size : 0.5,
          vibe: encBeastie.vibe && encBeastie.vibe > 0 ? encBeastie.vibe : 0,
          ability_index: ability_index,
          attklist: getMoveset(encBeastie, beastieData, level),
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          md_r: 1,
          hd_r: 1,
          ...training,
        }}
        noMoveWarning={true}
      />
    </div>
  );
}
