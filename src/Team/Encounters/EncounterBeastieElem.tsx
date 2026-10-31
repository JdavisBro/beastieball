import { EncounterBeastie } from "../../data/EncounterData";
import styles from "./Encounters.module.css";
import BEASTIE_DATA, { BeastieType } from "../../data/BeastieData";
import Beastie from "../Beastie/Beastie";
import { createPid } from "../Builder/createBeastie";
import getMoveset from "./getMoveset";
import Randomizer from "../../utils/Randomizer";
import { useMemo } from "react";
import useLocalization, {
  LocalizationFunction,
} from "../../localization/useLocalization";
import { TeamBeastie } from "../Types";
import VIBES from "../../data/raw/vibes.json";
import { ENCOUNTER_LIST, encounterPrettyName } from "./Encounters";

function hashCode(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash += text.charCodeAt(i);
    hash *= 691;
    hash = hash % 4294967296;
  }
  return hash;
}

const TRAINING_TYPE: ("ba_t" | "ha_t" | "ma_t" | "bd_t" | "hd_t" | "md_t")[] = [
  "ba_t",
  "ha_t",
  "ma_t",
  "bd_t",
  "hd_t",
  "md_t",
];
const MAX_TRAINING_POINTS = 240;

function linkColors(colors: number[], beastie: BeastieType) {
  for (const [key, val] of Object.entries(beastie.linked_colors)) {
    colors[Number(key.slice(1))] = colors[val];
  }
}

export function encounterToTeamBeastie(
  pid: string,
  encBeastie: EncounterBeastie,
  level: number,
  encounterId: string,
  index: number,
  overwrittenTrained: undefined | number,
  L: LocalizationFunction,
): TeamBeastie | null {
  const beastieData = BEASTIE_DATA.get(encBeastie.specie || "shroom1");
  if (!beastieData) {
    return null;
  }

  const randomizer = new Randomizer(1);
  randomizer.randomizer_seed(hashCode(encounterId) + index);
  randomizer.spam_random(6); // trainings
  const scale = randomizer.random();
  const vibe = Math.floor(randomizer.random() * VIBES.length);
  randomizer.random(); // xp
  const random_ability = beastieData.ability_hidden
    ? 0
    : Math.floor(randomizer.random(beastieData.ability.length));
  const random_colors = new Array(beastieData.colors.length)
    .fill(0.5)
    .map(() => randomizer.random());
  let ibisIndex = 0;
  if (beastieData.id == "ibis") {
    randomizer.spam_random(8);
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

  if (
    encBeastie.variant &&
    encBeastie.variant > -1 &&
    encBeastie.specie == "crab"
  )
    randomizer.random();

  linkColors(color, beastieData);

  const number =
    typeof encBeastie.number == "string" ||
    (encBeastie.number && encBeastie.number > -1)
      ? String(encBeastie.number)
      : String(Math.floor(randomizer.random() ** 3 * randomizer.random(10))) +
        String(Math.round(randomizer.random(9)));

  let metamorphedBeastie = beastieData;
  if (encBeastie.evolves) {
    let baby = BEASTIE_DATA.get(beastieData.family);
    const preMorphs = [];
    if (baby && baby.id != beastieData.id) {
      preMorphs.push(baby);
      while (baby?.evolution?.every((evo) => evo.specie != beastieData.id)) {
        baby = BEASTIE_DATA.get(baby.evolution[0].specie);
        preMorphs.push(baby);
      }
      preMorphs.push(beastieData);
    }

    for (let i = preMorphs.length - 1; i > 0; i--) {
      const current = preMorphs[i] ?? beastieData;
      const pre = preMorphs[i - 1] ?? current;
      if (
        !pre ||
        (pre.evolution &&
          pre.evolution.length > 1 &&
          [6, 8].includes(pre.evolution[1].condition[0]))
      )
        break;
      metamorphedBeastie = pre;

      if (i > 0 && current.colormeta?.length) {
        const origColor = [...color];
        if (current.colormeta.length > color.length)
          color.length = current.colormeta.length;
        for (let i = 0; i < current.colormeta.length; i++) {
          if (current.colormeta[i] >= 0 && current.colormeta[i] < color.length)
            color[i] = origColor[current.colormeta[i]];
        }
      }
    }

    while (metamorphedBeastie.evolution) {
      let meta = metamorphedBeastie.evolution.filter(
        (evo) =>
          evo.condition.some((cond) => [0, 4, 5, 9, 10, 11].includes(cond)) &&
          typeof evo.value[0] == "number" &&
          evo.value[0] <= level,
      );
      if (!meta.length) {
        meta = metamorphedBeastie.evolution.filter((evo) =>
          evo.condition.some((cond) => cond == 2 || cond == 1),
        );
        if (meta.length > 1) {
          meta = meta.filter((evo) => evo.specie == beastieData.id);
          if (!meta.length) meta = metamorphedBeastie.evolution;
        }
        if (!meta.length || level < 28) break;
      }
      metamorphedBeastie = BEASTIE_DATA.get(meta[0].specie) ?? beastieData;
      while (color.length < metamorphedBeastie.colors.length) {
        color.push(randomizer.random() + variant);
      }
      if (metamorphedBeastie.colormeta?.length) {
        const origColor = [...color];
        for (let i = 0; i < metamorphedBeastie.colormeta.length; i++) {
          if (metamorphedBeastie.colormeta[i] >= 0)
            color[metamorphedBeastie.colormeta[i]] = origColor[i];
        }
      }
      linkColors(color, beastieData);
    }
  }
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
  const trained = overwrittenTrained ?? encBeastie.trained;
  if (trained && trained > 0 && Array.isArray(encBeastie.training)) {
    const total_points = Math.round(MAX_TRAINING_POINTS * trained);
    const total_alloc = encBeastie.training.reduce((p, n) => p + n);
    const getStat = (num: number) =>
      Math.min(120, Math.round((total_points * num) / total_alloc));
    training.ba_t = getStat(encBeastie.training[0]);
    training.ha_t = getStat(encBeastie.training[1]);
    training.ma_t = getStat(encBeastie.training[2]);
    training.bd_t = getStat(encBeastie.training[3]);
    training.hd_t = getStat(encBeastie.training[4]);
    training.md_t = getStat(encBeastie.training[5]);

    // ensure not over max points
    let points_used = 0;
    for (const type of TRAINING_TYPE) {
      if (points_used > MAX_TRAINING_POINTS) {
        training[type] = 0;
        continue;
      }
      points_used += training[type];
      if (points_used > MAX_TRAINING_POINTS) {
        training[type] = training[type] - (points_used - MAX_TRAINING_POINTS);
      }
    }
  }

  return {
    pid: pid,
    specie: metamorphedBeastie.id,
    date: 1,
    number: number.length ? number.padStart(2, "0") : number,
    color: color,
    name: encBeastie.name ? L(encBeastie.name) : "",
    spr_index: spr_index,
    xp: level ** 3 * metamorphedBeastie.growth,
    scale:
      encBeastie.size !== undefined && encBeastie.size >= 0
        ? encBeastie.size
        : scale,
    vibe:
      encBeastie.vibe !== undefined && encBeastie.vibe >= 0
        ? encBeastie.vibe
        : vibe,
    ability_index: ability_index,
    attklist: getMoveset(encBeastie, metamorphedBeastie, level),
    ba_r: 1,
    ha_r: 1,
    ma_r: 1,
    bd_r: 1,
    md_r: 1,
    hd_r: 1,
    ...training,
  };
}

export default function EncounterBeastieElem({
  encounterId,
  encounterIndex,
  fromEncounterId,
  fromEncounterIndex,
  encBeastie,
  bonus_levels,
  overwrittenTrained,
  setSeedOption,
}: {
  encounterId: string;
  encounterIndex: number;
  fromEncounterId: string;
  fromEncounterIndex: number;
  encBeastie: EncounterBeastie;
  bonus_levels: number;
  overwrittenTrained?: number;
  setSeedOption?: (value: string) => void;
}) {
  const { L, languageExtensionData } = useLocalization();

  const level = encBeastie.level + Math.floor(bonus_levels);

  const pid = useMemo(createPid, [encounterId]);

  const loadedLang = languageExtensionData.encounters?.lang;
  const teamBeastie = useMemo(
    () =>
      encounterToTeamBeastie(
        pid,
        encBeastie,
        level,
        encounterId,
        encounterIndex,
        overwrittenTrained,
        L,
      ),
    [
      pid,
      loadedLang,
      encBeastie,
      level,
      encounterId,
      encounterIndex,
      overwrittenTrained,
    ],
  );

  if (!teamBeastie) {
    return null;
  }

  const seeds =
    setSeedOption &&
    ENCOUNTER_LIST.flatMap((enc) =>
      enc.team
        .map<[EncounterBeastie, number]>((beastie, beastieIndex) => [
          beastie,
          beastieIndex,
        ])
        .filter(
          ([beastie, beastieIndex]) =>
            (beastie.from_encounter ?? enc.id) == fromEncounterId &&
            (beastie.from_encounter_index ?? beastieIndex) ==
              fromEncounterIndex,
        )
        .map<[string, number]>(([, beastieIndex]) => [enc.id, beastieIndex]),
    );

  return (
    <div className={styles.beastieContainer}>
      <Beastie teamBeastie={teamBeastie} noMoveWarning={true} />
      {setSeedOption && (
        <select
          title={`${encounterId}###${encounterIndex}`}
          value={`${encounterId}###${encounterIndex}`}
          onChange={(event) => setSeedOption(event.currentTarget.value)}
        >
          {seeds?.map(([id, ind]) => (
            <option key={`${id}###${ind}`} value={`${id}###${ind}`}>
              {encounterPrettyName(id)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
