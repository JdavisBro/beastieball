import BEASTIE_DATA from "../../data/BeastieData";
import { LocalizationFunction } from "../../localization/useLocalization";
import { TeamBeastie } from "../Types";
import createBeastie from "./createBeastie";

export class DecodeError extends Error {}

const BASE = 64;
const char_key =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function encodeBase(num: number) {
  let data = "";
  while (num > 0 || !data.length) {
    data += char_key[num % BASE];
    num = Math.floor(num / BASE);
  }
  return data;
}

function decodeBase(data: string) {
  let num = 0;
  if (!data.length) return 0;
  for (let i = data.length - 1; i >= 0; i--) {
    const char = char_key.indexOf(data[i]);
    if (char < 0) throw new DecodeError("Invalid Character");
    num += char * Math.pow(BASE, i);
  }
  return num;
}

const TRAINING_TYPE: ("ba_t" | "ha_t" | "ma_t" | "bd_t" | "hd_t" | "md_t")[] = [
  "ba_t",
  "ha_t",
  "ma_t",
  "bd_t",
  "hd_t",
  "md_t",
];

const BEASTIE_NUM_MASK = 0b000011111111;
const BEASTIE_ABILITY_MASK = 0b100000000000;
const BEASTIE_SHINY_MASK = 0b010000000000;
const BEASTIE_ALT_MASK = 0b001000000000;
// const BEASTIE_UNUSED_MASK = 0b000100000000;

export function encodeTeam(team: TeamBeastie[]): string {
  let data = "";
  for (const beastie of team) {
    const beastie_data = BEASTIE_DATA.get(beastie.specie);
    if (!beastie_data) continue;
    let beastie_number = beastie_data.number;
    beastie_number |= BEASTIE_ABILITY_MASK * beastie.ability_index;
    const color_floor = Math.floor(beastie.color[0]);
    beastie_number |= color_floor == 1 ? BEASTIE_SHINY_MASK : 0;
    beastie_number |=
      BEASTIE_ALT_MASK *
      Number(
        (beastie_data.spr_alt.length && beastie.spr_index) ||
          (beastie_data.colors2 && color_floor == 2),
      );
    data += encodeBase(beastie_number).padEnd(2, char_key[0]);
    for (const attk of beastie.attklist) {
      const ind = beastie_data.attklist.indexOf(attk);
      data += encodeBase(ind > 0 ? ind : 0);
    }
    let training_bitmap = 0;
    let training = "";
    for (let i = 0; i < TRAINING_TYPE.length; i++) {
      const type = TRAINING_TYPE[i];
      const value = Math.min(30, Math.floor(beastie[type] / 4));
      if (value) {
        training_bitmap |= 1 << i;
        training += encodeBase(value);
      }
    }
    data += encodeBase(training_bitmap) + training;
  }
  return data;
}

export function decodeTeam(
  data: string,
  L: LocalizationFunction,
): TeamBeastie[] {
  const team: TeamBeastie[] = [];
  let i = 0;
  while (i < data.length) {
    const beastie_field = decodeBase(data.slice(i, i + 2));
    i += 2;
    const beastie_num = beastie_field & BEASTIE_NUM_MASK;
    const beastie_data = [...BEASTIE_DATA.values()].find(
      (beastie) => beastie.number == beastie_num,
    );
    if (!beastie_data) throw new DecodeError("Invalid Beastie Number");
    const beastie = createBeastie(
      "0" + String(team.length + 1),
      beastie_data.id,
      L,
    );
    beastie.ability_index = beastie_field & BEASTIE_ABILITY_MASK ? 1 : 0;
    const color_add =
      beastie_field & BEASTIE_SHINY_MASK
        ? 1
        : beastie_data.colors2 && beastie_field & BEASTIE_ALT_MASK
          ? 2
          : 0;
    if (color_add) {
      for (let color_i = 0; color_i < beastie.color.length; color_i++) {
        beastie.color[color_i] += color_add;
      }
    }
    beastie.spr_index =
      beastie_data.spr_alt.length && beastie_field & BEASTIE_ALT_MASK ? 1 : 0;
    for (let move_i = 0; move_i < 3; move_i++) {
      const move_list_index = decodeBase(data[i]);
      beastie.attklist[move_i] = beastie_data.attklist[move_list_index];
      i += 1;
    }
    const training_bitmap = decodeBase(data[i]);
    i += 1;
    for (let training_i = 0; training_i < TRAINING_TYPE.length; training_i++) {
      if (training_bitmap & (1 << training_i)) {
        const type = TRAINING_TYPE[training_i];
        let value = decodeBase(data[i]);
        beastie[type] = Math.min(30, value) * 4;
        i += 1;
      }
    }
    team.push(beastie);
    if (team.length == 5) break;
  }
  return team;
}
