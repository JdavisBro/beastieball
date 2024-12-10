import type { TeamBeastie } from "../Types";

const PID_CHARS = "0123456789abcdef";
const PID_LENGTH = 32;

export function createPid() {
  let pid = "";
  for (let i = 0; i < PID_LENGTH; i++) {
    pid += PID_CHARS[Math.floor(Math.random() * PID_CHARS.length)];
  }

  return pid;
}

export default function createBeastie(number: string): TeamBeastie {
  return {
    pid: createPid(),
    specie: "shroom1",
    date: 1,
    number: number,
    color: [0.5, 0.5, 0.5, 0.5, 0.5],
    name: "Sprecko",
    spr_index: 0,
    xp: 125000,
    scale: 0.5,
    vibe: 0,
    ability_index: 0,
    attklist: ["careful", "callout", "refresh"],

    ba_r: 1,
    ha_r: 1,
    ma_r: 1,
    bd_r: 1,
    hd_r: 1,
    md_r: 1,

    ba_t: 0,
    ha_t: 0,
    ma_t: 0,
    bd_t: 0,
    hd_t: 0,
    md_t: 0,
  };
}
