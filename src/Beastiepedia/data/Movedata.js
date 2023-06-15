// @flow strict

import { Type } from "./MoveType";
import type { MoveType } from "./MoveType";

const MOVE_DATA: Map<string, MoveType> = new Map();

MOVE_DATA.set("???", {
  name: "Unrevealed",
  desc: "",
  type: Type.Unknown,
  power: null,
})
  .set("chance", {
    name: "Free Ball",
    desc: "PASS to an opponent and skip your attack. Can always be used.",
    type: Type.Pass,
    power: 0,
  })
  .set("volley", {
    name: "Volley",
    desc: "A basic PASS",
    type: Type.Pass,
    power: null,
  })
  .set("move", {
    name: "Move",
    desc: "MOVE to a selected space.",
    type: Type.Movement,
    power: null,
  })
  .set("tagout", {
    name: "Tag Out",
    desc: "TAG OUT with a benched ally. only during defence.",
    type: Type.Swap,
    power: null,
  })
  .set("defence", {
    name: "Block",
    desc: "Only used from net. Target feels 1 [sprStatus,9]BLOCKED (POW x0.5).",
    type: Type.Defence,
    power: null,
  })
  .set("meter", {
    name: "Rowdy",
    desc: "",
    type: Type.Support,
    power: null,
  })
  .set("xtra", {
    name: "Bonus",
    desc: "",
    type: Type.Unknown,
    power: null,
  })
  .set("shakenhit", {
    name: "Reach Shot",
    desc:
      "Auto-targets front row. Target feels 1 [sprStatus,2]SHOOK (can't attack).",
    type: Type.Body,
    power: 0,
  })
  .set("superfang", {
    name: "Grinder",
    desc: "Damage equals 50% of targets remaining STAMINA.",
    type: Type.Body,
    power: 0,
  })
  .set("storedpower", {
    name: "Energized",
    desc: "POW +10 for each [sprBoost,0]BOOST on the user.",
    type: Type.Body,
    power: 15,
  })
  .set("sideshot", {
    name: "Sidewinder",
    desc: "Targets SIDEWAYS. SHIFTs target to opposite lane after hitting.",
    type: Type.Body,
    power: 35,
  })
  .set("bounce", {
    name: "Bump",
    desc: "Can hit without volleying.",
    type: Type.Body,
    power: 35,
  })
  .set("sensihit", {
    name: "Zinger",
    desc: "Target feels 2 [sprStatus,11]TENDER (defences[sprBoost,4]).",
    type: Type.Body,
    power: 35,
  })
  .set("rocksmash", {
    name: "Breaker",
    desc: "[sprIcon,0]DEF[sprBoost,3] to target.",
    type: Type.Body,
    power: 50,
  })
  .set("topspin", {
    name: "Bounce",
    desc: "Targets SIDEWAYS.",
    type: Type.Body,
    power: 50,
  })
  .set("healhit", {
    name: "Relaxed Hit",
    desc: "HEALs self +20.",
    type: Type.Body,
    power: 50,
  })
  .set("tagattk", {
    name: "Momentum",
    desc: "POW x2 if user just TAGGED IN.",
    type: Type.Body,
    power: 50,
  })
  .set("brine", {
    name: "Finisher",
    desc: "POW x2 if target STAMINA is under 50.",
    type: Type.Body,
    power: 55,
  })
  .set("breakswipe", {
    name: "Kneebender",
    desc: "[sprIcon,0]POW[sprBoost,3] to target.",
    type: Type.Body,
    power: 60,
  })
  .set("serve", {
    name: "Muscle Memory",
    desc: "POW x1.5 if used to serve.",
    type: Type.Body,
    power: 70,
  })
  .set("healhit2", {
    name: "Power Sap",
    desc: "HEALs self +10.",
    type: Type.Body,
    power: 75,
  })
  .set("pushattack", {
    name: "Shove",
    desc: "Only used from net. SHIFTs target to back row after hitting.",
    type: Type.Body,
    power: 75,
  })
  .set("rocket", {
    name: "Rocket",
    desc: "Stronger when recieved in the back.",
    type: Type.Body,
    power: 80,
  })
  .set("ceiling", {
    name: "Sky Attack",
    desc: "Only used from back row. Damages based on target's [sprIcon,2]DEF.",
    type: Type.Body,
    power: 80,
  })
  .set("blockattack", {
    name: "High Slam",
    desc:
      "Only used from net. Auto-targets my lane. Can hit without volleying.",
    type: Type.Body,
    power: 80,
  })
  .set("body", {
    name: "Thump",
    desc: "A basic [sprIcon,0] ATTACK.",
    type: Type.Body,
    power: 90,
  })
  .set("slipshot", {
    name: "Slip Shot",
    desc: "Easy recieve.",
    type: Type.Body,
    power: 95,
  })
  .set("jump", {
    name: "Spike",
    desc: "Only used from net.",
    type: Type.Body,
    power: 100,
  })
  .set("rushattack", {
    name: "Launch",
    desc: "Only used from back row. SHIFTs self to front row after hitting.",
    type: Type.Body,
    power: 100,
  })
  .set("thunder", {
    name: "Thunder",
    desc: "Only used from net. Auto-targets back row.",
    type: Type.Body,
    power: 110,
  })
  .set("superpower", {
    name: "Overpower",
    desc:
      "[sprIcon,0]POW[sprBoost,3] to self. [sprIcon,0]DEF[sprBoost,3] to self.",
    type: Type.Body,
    power: 120,
  })
  .set("vigor", {
    name: "Vigor Beam",
    desc: "Only used from net. Strongest when user has more STAMINA.",
    type: Type.Body,
    power: 135,
  })
  .set("hyperbeam", {
    name: "Hyperspike",
    desc: "Feel 2 [sprStatus,10]TIRED (only basic actions).",
    type: Type.Body,
    power: 135,
  })
  .set("3actions", {
    name: "Ultimate Attack",
    desc: "Requires 3 ACTIONS.",
    type: Type.Body,
    power: 160,
  })
  .set("steamattack", {
    name: "Steamer",
    desc:
      "Auto-targets my lane. Target feels 3 [sprStatus,6]SWEATY (losing stamina).",
    type: Type.Spirit,
    power: 1,
  });

export default MOVE_DATA;
