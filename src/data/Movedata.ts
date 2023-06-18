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
    desc: "Auto-targets front row. Target feels 1 [sprStatus,2]SHOOK (can't attack).",
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
    desc: "Only used from net. Auto-targets my lane. Can hit without volleying.",
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
    desc: "[sprIcon,0]POW[sprBoost,3] to self. [sprIcon,0]DEF[sprBoost,3] to self.",
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
    desc: "Auto-targets my lane. Target feels 3 [sprStatus,6]SWEATY (losing stamina).",
    type: Type.Spirit,
    power: 1,
  })
  .set("pepshot", {
    name: "Pepshot",
    desc: "ATTACK. [sprIcon,1]POW[sprBoost,0] to self.",
    type: Type.Spirit,
    power: 40,
  })
  .set("careful", {
    name: "Careful Shot",
    desc: "ATTACK. Targets SIDEWAYS.",
    type: Type.Spirit,
    power: 40,
  })
  .set("jazzattack", {
    name: "Thriller",
    desc: "Feel 1 [sprStatus,8]JAZZED (POW x1.5) before contact.",
    type: Type.Spirit,
    power: 55,
  })
  .set("bomb", {
    name: "Bang",
    desc: "Additional 50% damage to target ally.",
    type: Type.Spirit,
    power: 55,
  })
  .set("enemyboosts", {
    name: "Toppler",
    desc: "Pow +30% for each [sprBoost,1]BOOST on target.",
    type: Type.Spirit,
    power: 60,
  })
  .set("scoreboosted", {
    name: "Comeback",
    desc: "POW x1.5 if tied or behind on score.",
    type: Type.Spirit,
    power: 60,
  })
  .set("dragontail", {
    name: "Tornadoball",
    desc: "Force target to TAG OUT.",
    type: Type.Spirit,
    power: 60,
  })
  .set("shieldbreaker", {
    name: "Raw Fury",
    desc: "Ignores target shields and [sprBoost,2][sprBoost,5]BOOSTS.",
    type: Type.Spirit,
    power: 65,
  })
  .set("inferno", {
    name: "Explosion",
    desc: "Damages all enemies. Additional 50% damage to active team.",
    type: Type.Spirit,
    power: 70,
  })
  .set("minddown", {
    name: "Jammer",
    desc: "[sprIcon,2]POW[sprBoost,3]",
    type: Type.Spirit,
    power: 70,
  })
  .set("facade", {
    name: "Grit",
    desc: "POW x2 if user has a bad FEELING.",
    type: Type.Spirit,
    power: 70,
  })
  .set("desperate", {
    name: "Desperate Dive",
    desc: "Can hit without volleying. Feel 1 [sprStatus,12]STRESSED (becomes [sprStatus,10]TIRED).",
    type: Type.Spirit,
    power: 75,
  })
  .set("damagedattack", {
    name: "Counter",
    desc: "POW x1.5 if user received the ball.",
    type: Type.Spirit,
    power: 75,
  })
  .set("heart", {
    name: "Bring the Heat",
    desc: "A basic [sprIcon,1] ATTACK.",
    type: Type.Spirit,
    power: 85,
  })
  .set("cut", {
    name: "Cut Shot",
    desc: "Only used from net. Auto-targets front row. Feel 2 [sprStatus,9]BLOCKED (POW x0.5).",
    type: Type.Spirit,
    power: 95,
  })
  .set("dare", {
    name: "Challenge",
    desc: "[sprIcon,0]POW[sprBoost,0] to target. [sprIcon,1]POW[sprBoost,0] to target.",
    type: Type.Spirit,
    power: 100,
  })
  .set("commit", {
    name: "Supercommit",
    desc: "Feel 1 [sprStatus,0]NERVOUS (can't move).",
    type: Type.Spirit,
    power: 100,
  })
  .set("overheat", {
    name: "Burnout",
    desc: "[sprStatus,1]POW[sprBoost,4] to self.",
    type: Type.Spirit,
    power: 120,
  })
  .set("flyback", {
    name: "Airblast",
    desc: "Only used from net. SHIFTs self to back row after hitting.",
    type: Type.Spirit,
    power: 130,
  })
  .set("reversal", {
    name: "Turnabout",
    desc: "Strongest when user has less STAMINA.",
    type: Type.Spirit,
    power: 180,
  })
  .set("nightshade", {
    name: "Precision",
    desc: "Auto-targets back row. Always does 30 damage.",
    type: Type.Mind,
    power: 0,
  })
  .set("poisonhit", {
    name: "Cornershot",
    desc: "Auto-targets back row. Always does 30 damage.",
    type: Type.Mind,
    power: 30,
  })
  .set("stun", {
    name: "Freezer",
    desc: "Target feels 1 [sprStatus,0]NERVOUS (can't move).",
    type: Type.Mind,
    power: 40,
  })
  .set("shakenmind", {
    name: "Twisted",
    desc: "Target feels 1 [sprStatus,2]SHOOK (can't attack).",
    type: Type.Mind,
    power: 40,
  })
  .set("markattack", {
    name: "Tracker",
    desc: "Target feels 1 [sprStatus,9]BLOCKED (POW x0.5).",
    type: Type.Mind,
    power: 45,
  })
  .set("mindbomb", {
    name: "Mindfield",
    desc: "Damages all enemies.",
    type: Type.Mind,
    power: 45,
  })
  .set("pursuit", {
    name: "Pressure",
    desc: "POW x2 if target just TAGGED IN.",
    type: Type.Mind,
    power: 50,
  })
  .set("passattack", {
    name: "Zigzag",
    desc: "POW +50% for each time the ball was passed.",
    type: Type.Mind,
    power: 50,
  })
  .set("dropshot", {
    name: "Lure Shot",
    desc: "SHIFTs target to front row after hitting.",
    type: Type.Mind,
    power: 55,
  })
  .set("hex", {
    name: "Nerve Strike",
    desc: "POW x2 if target just TAGGED IN.",
    type: Type.Mind,
    power: 55,
  })
  .set("float", {
    name: "Floater",
    desc: "SHIFTs target to back row after hitting.",
    type: Type.Mind,
    power: 60,
  })
  .set("sidespin", {
    name: "Slice",
    desc: "Targets SIDEWAYS.",
    type: Type.Mind,
    power: 60,
  })
  .set("heartd", {
    name: "Cold Calculation",
    desc: "[sprIcon,1]DEF[sprBoost,0] to self.",
    type: Type.Mind,
    power: 60,
  })
  .set("hazeball", {
    name: "Numbshot",
    desc: "Clears BOOSTS from target.",
    type: Type.Mind,
    power: 65,
  })
  .set("mind", {
    name: "Prepared Attack",
    desc: "[sprIcon,2]DEF[sprBoost,0] to self.",
    type: Type.Mind,
    power: 70,
  })
  .set("netattack", {
    name: "Sneak Attack",
    desc: "SHIFTs self to front row after hitting.",
    type: Type.Mind,
    power: 70,
  })
  .set("spitball", {
    name: "Spitball",
    desc: "Target feels 1 [sprStatus,1]ANGRY (can't use support).",
    type: Type.Mind,
    power: 75,
  })
  .set("heartdown", {
    name: "Heartbreaker",
    desc: "[sprIcon,1]POW[sprBoost,3]",
    type: Type.Mind,
    power: 75,
  })
  .set("rollshot", {
    name: "Roll Shot",
    desc: "Only used from net. Auto-targets back row. Ignores [sprStatus,9]BLOCKED.",
    type: Type.Mind,
    power: 80,
  })
  .set("dump", {
    name: "Dump",
    desc: "Only used from net. Auto-targets front row.",
    type: Type.Mind,
    power: 85,
  })
  .set("moon", {
    name: "Rainbow",
    desc: "Only used from back row. Auto-targets back row.",
    type: Type.Mind,
    power: 100,
  })
  .set("targethp", {
    name: "Soulcrusher",
    desc: "Strongest when target has more STAMINA.",
    type: Type.Mind,
    power: 120,
  })
  .set("wornattack", {
    name: "Perfect Shot",
    desc: "Requires 2 ACTIONS.",
    type: Type.Mind,
    power: 125,
  })
  .set("starterbody", {
    name: "Basic Hit",
    desc: "A basic [sprIcon,0] ATTACK.",
    type: Type.Body,
    power: 50,
  })
  .set("starterheart", {
    name: "Beginner Effort",
    desc: "A basic [sprIcon,1] ATTACK.",
    type: Type.Spirit,
    power: 45,
  })
  .set("startermind", {
    name: "Practice Shot",
    desc: "A basic [sprIcon,2] ATTACK.",
    type: Type.Mind,
    power: 40,
  })
  .set("starterside", {
    name: "Trickspin",
    desc: "Targets SIDEWAYS. [sprIcon,2]DEF[sprBoost,3] to target.",
    type: Type.Mind,
    power: 35,
  })
  .set("rush", {
    name: "Net Rush",
    desc: "VOLLEY ball. SHIFTs self to front row.",
    type: Type.Pass,
    power: null,
  })
  .set("cover", {
    name: "Cover",
    desc: "VOLLEY ball. SHIFTs self to back row.",
    type: Type.Pass,
    power: null,
  })
  .set("set", {
    name: "Set",
    desc: "VOLLEY ball. Ally feels 1 [sprStatus,8]JAZZED (POW x1.5).",
    type: Type.Pass,
    power: null,
  })
  .set("dig", {
    name: "Dig",
    desc: "VOLLEY ball. Feel 1 [sprStatus,8]JAZZED (POW x1.5).",
    type: Type.Pass,
    power: null,
  })
  .set("refresh", {
    name: "Refresh",
    desc: "VOLLEY ball. HEALs ally +20.",
    type: Type.Pass,
    power: null,
  })
  .set("freeball", {
    name: "Updraft",
    desc: "VOLLEY ball. +1 ACTIONs. -50 STMINA.",
    type: Type.Pass,
    power: null,
  })
  .set("quickattack", {
    name: "Quick",
    desc: "VOLLEY ball. [sprIcon,0]POW[sprBoost,0] to ally.",
    type: Type.Pass,
    power: null,
  })
  .set("superquick", {
    name: "Super Quick",
    desc: "Only used from net. VOLLEY ball. [sprIcon,0]POW[sprBoost,1] to ally.",
    type: Type.Pass,
    power: null,
  })
  .set("heartpass", {
    name: "Faith",
    desc: "VOLLEY ball. [sprIcon,1]POW[sprBoost,0] to ally.",
    type: Type.Pass,
    power: null,
  })
  .set("mindpass", {
    name: "Tactical Pass",
    desc: "VOLLEY ball. [sprIcon,2]POW[sprBoost,0] to ally.",
    type: Type.Pass,
    power: null,
  })
  .set("allyrush", {
    name: "Forward Pass",
    desc: "VOLLEY ball. SHIFTs ally to front row.",
    type: Type.Pass,
    power: null,
  })
  .set("allycover", {
    name: "Pipe",
    desc: "VOLLEY ball. SHIFTs ally to back row.",
    type: Type.Pass,
    power: null,
  })
  .set("juggle", {
    name: "Juggle",
    desc: "Ball goes to self. [sprIcon,0]POW[sprBoost,0] to self.",
    type: Type.Pass,
    power: null,
  })
  .set("jazzpass", {
    name: "Perfect Pass",
    desc: "Only used from net VOLLEY ball. SHIFTs ally to front row. Ally feels 1 [sprStatus,8]JAZZED (POW x1.5).",
    type: Type.Pass,
    power: null,
  })
  .set("myheartpass", {
    name: "Excited Pass",
    desc: "VOLLEY ball. [sprIcon,1]POW[sprBoost,0] to self.",
    type: Type.Pass,
    power: null,
  })
  .set("stresspass", {
    name: "Demanding Set",
    desc: "VOLLEY ball. [sprIcon,0][sprIcon,1][sprIcon,2]POW[sprBoost,1] to ally. Ally feels 1 [sprStatus,12]STRESSED (becomes [sprStatus,10]TIRED).",
    type: Type.Pass,
    power: null,
  })
  .set("feint", {
    name: "Feint",
    desc: "[sprIcon,0][sprIcon,1][sprIcon,2]DEF[sprBoost,3] to target.",
    type: Type.Support,
    power: null,
  })
  .set("switch", {
    name: "Reposition",
    desc: "SWITCH places with fielded ally.",
    type: Type.Support,
    power: null,
  })
  .set("teleport", {
    name: "Teleport",
    desc: "SWITCH places with ally without moving ball.",
    type: Type.Support,
    power: null,
  })
  .set("cheer", {
    name: "Cheer",
    desc: "[sprIcon,0][sprIcon,1][sprIcon,2]POW[sprBoost,1] to ally.",
    type: Type.Support,
    power: null,
  })
  .set("callout", {
    name: "Call Out",
    desc: "[sprIcon,0][sprIcon,1][sprIcon,2]DEF[sprBoost,1] to ally.",
    type: Type.Support,
    power: null,
  })
  .set("recover", {
    name: "Deep Breath",
    desc: "HEALs self +50.",
    type: Type.Support,
    power: null,
  })
  .set("meditate", {
    name: "Meditate",
    desc: "HEALs self +100. Feel 2 [sprStatus,0]NERVOUS (can't move).",
    type: Type.Support,
    power: null,
  })
  .set("curse", {
    name: "Flex",
    desc: "[sprIcon,0]POW[sprBoost,0] to self. [sprIcon,0]DEF[sprBoost,0] to self.",
    type: Type.Support,
    power: null,
  })
  .set("rest", {
    name: "Doze",
    desc: "HEALS self +100. Feel 3 [sprStatus,10]TIRED (only basic actions).",
    type: Type.Support,
    power: null,
  })
  .set("lifedew", {
    name: "Calming Aura",
    desc: "HEALs active team +20.",
    type: Type.Support,
    power: null,
  })
  .set("taunt", {
    name: "Provoke",
    desc: "Target feels 2 [sprStatus,1]ANGRY (can't use support).",
    type: Type.Support,
    power: null,
  })
  .set("substitute", {
    name: "Tough Front",
    desc: "-33 STAMINA. Feel 2 [sprStatus,4]TOUGH (shielded).",
    type: Type.Support,
    power: null,
  })
  .set("swordsdance", {
    name: "Pump Up",
    desc: "[sprIcon,0]POW[sprBoost,1] to self.",
    type: Type.Support,
    power: null,
  })
  .set("heartup", {
    name: "Battle Cry",
    desc: "[sprIcon,1]POW[sprBoost,1] to self.",
    type: Type.Support,
    power: null,
  })
  .set("mindup", {
    name: "Assess",
    desc: "[sprIcon,2]POW[sprBoost,1] to self.",
    type: Type.Support,
    power: null,
  })
  .set("preblock", {
    name: "Hunker",
    desc: "[sprIcon,0][sprIcon,1][sprIcon,2]DEF[sprBoost,0] to self. Feel 1 [sprStatus,0]NERVOUS (can't move).",
    type: Type.Support,
    power: null,
  })
  .set("followme", {
    name: "Whistle",
    desc: "Feel 1 [sprIcon,3]NOISY (draws attacks).",
    type: Type.Support,
    power: null,
  })
  .set("telekinesis", {
    name: "Telekinesis",
    desc: "Ball goes to self. [sprIcon,2]POW[sprBoost,0] to self.",
    type: Type.Support,
    power: null,
  })
  .set("dispel", {
    name: "Dispel",
    desc: "Ally's ball becomes VOLLEYed.",
    type: Type.Support,
    power: null,
  })
  .set("wornout", {
    name: "Hex",
    desc: "Target feels 1 [sprStatus,5]WIPED (must bench). Feel 2 [sprStatus,5]WIPED (must bench).",
    type: Type.Support,
    power: null,
  })
  .set("tailwind", {
    name: "Tailwind",
    desc: "SHIFTs active team to front row.",
    type: Type.Support,
    power: null,
  })
  .set("bellydrum", {
    name: "Blaze",
    desc: "[sprIcon,1]POW[sprBoost,2][sprBoost,2] to self. -50 STAMINA.",
    type: Type.Support,
    power: null,
  })
  .set("overthink", {
    name: "Overthink",
    desc: "[sprIcon,2]POW[sprBoost,2] to self. Feel 1 [sprStatus,12]STRESSED (becomes [sprStatus,10]TIRED).",
    type: Type.Support,
    power: null,
  })
  .set("lockon", {
    name: "Lock Target",
    desc: "Target feels 1 [sprStatus,3]NOISY (draws attacks).",
    type: Type.Support,
    power: null,
  })
  .set("lowattks", {
    name: "Jeer",
    desc: "[sprIcon,0]POW[sprBoost,3] to target. [sprIcon,2]POW[sprBoost,3] to target.",
    type: Type.Support,
    power: null,
  })
  .set("charm", {
    name: "Goo-Goo Eyes",
    desc: "[sprIcon,0]POW[sprBoost,4] to target.",
    type: Type.Support,
    power: null,
  })
  .set("mark", {
    name: "Mark",
    desc: "Target feels 1 [sprStatus,9]BLOCKED (POW x0.5).",
    type: Type.Support,
    power: null,
  })
  .set("bench", {
    name: "Quick Tag",
    desc: "TAG OUT with benched ally.",
    type: Type.Support,
    power: null,
  })
  .set("introduction", {
    name: "Introduce",
    desc: "Benched ally feels 1 [sprStatus,4]TOUGH (shielded).",
    type: Type.Support,
    power: null,
  })
  .set("healbell", {
    name: "Team Chant",
    desc: "Clears all FEELINGs from entire team.",
    type: Type.Support,
    power: null,
  })
  .set("haze", {
    name: "Patience",
    desc: "Clears BOOSTS from every fielded player.",
    type: Type.Support,
    power: null,
  })
  .set("nettle", {
    name: "Nettle",
    desc: "-20 STAMINA to target.",
    type: Type.Support,
    power: null,
  })
  .set("construct", {
    name: "Build",
    desc: "Only used from back row. Build a WALL in front of self. -34 STAMINA.",
    type: Type.Support,
    power: null,
  })
  .set("fieldclear", {
    name: "Clear Field",
    desc: "Clears all FIELD EFFECTS.",
    type: Type.Support,
    power: null,
  })
  .set("crowd", {
    name: "Rally",
    desc: "Entire field gets +1 CROWD ([sprIcon,1] +20%, [sprIcon,2] +20%).",
    type: Type.Support,
    power: null,
  })
  .set("trap", {
    name: "Lay Trap",
    desc: "Opponent field gets +1 TRAP (Tag-ins lose 10 stamina).",
    type: Type.Support,
    power: null,
  })
  .set("rhythm", {
    name: "Drum",
    desc: "Ally field gets 6 RHYTHM (Healing and protection).",
    type: Type.Support,
    power: null,
  })
  .set("libero", {
    name: "Hawkeye",
    desc: "Target feels 1 [sprStatus,9]BLOCKED (POW x0.5). [sprIcon,0][sprIcon,1][sprIcon,2]DEF[sprBoost,3] to self.",
    type: Type.Defence,
    power: null,
  })
  .set("defheal", {
    name: "Quick Breath",
    desc: "HEALs self +33.",
    type: Type.Defence,
    power: null,
  })
  .set("protect", {
    name: "Shield",
    desc: "Feel 1 [sprStatus,4]TOUGH (shielded) + 2 [sprStatus,1]ANGRY (can't use support).",
    type: Type.Defence,
    power: null,
  })
  .set("allyprotect", {
    name: "Tough Talk",
    desc: "Ally feels 1 [sprStatus,4]TOUGH (shielded). Active team feels 2 [sprStatus,1]ANGRY (can't use support).",
    type: Type.Defence,
    power: null,
  })
  .set("bdefup", {
    name: "Body Ready",
    desc: "[sprIcon,0]DEF[sprBoost,1] to self.",
    type: Type.Defence,
    power: null,
  })
  .set("hdefup", {
    name: "Heart Harden",
    desc: "[sprIcon,1]DEF[sprBoost,1] to self.",
    type: Type.Defence,
    power: null,
  })
  .set("mdefup", {
    name: "Mind Read",
    desc: "[sprIcon,2]DEF[sprBoost,1] to self.",
    type: Type.Defence,
    power: null,
  })
  .set("basecover", {
    name: "Fall Back",
    desc: "SHIFTs active team to back row.",
    type: Type.Defence,
    power: null,
  })
  .set("backswitch", {
    name: "Role Reverse",
    desc: "SHIFTs active team to opposite row.",
    type: Type.Defence,
    power: null,
  })
  .set("batonpass", {
    name: "High Five",
    desc: "TAG OUT with benched ally. Tranfer [sprBoost,2][sprBoost,5]BOOSTS to benched ally.",
    type: Type.Defence,
    power: null,
  })
  .set("lifepass", {
    name: "Torch Pass",
    desc: "-100 STAMINA. TAG OUT. Restores benched ally's stamina and [sprStatus,5]WIPED.",
    type: Type.Defence,
    power: null,
  })
  .set("powswitch", {
    name: "Smack",
    desc: "TAG OUT with benched ally. [sprIcon,0][sprIcon,1][sprIcon,2]POW[sprBoost,0] to benched ally.",
    type: Type.Defence,
    power: null,
  })
  .set("whirlwind", {
    name: "Cyclone",
    desc: "Force target to TAG OUT.",
    type: Type.Defence,
    power: null,
  })
  .set("lock", {
    name: "Staredown",
    desc: "SHIFTs self to front row. Target feels [sprStatus,0]NERVOUS (can't move).",
    type: Type.Defence,
    power: null,
  })
  .set("threat", {
    name: "Intimidate",
    desc: "Target feels 1 [sprStatus,11]TENDER (defences[sprBoost,4]).",
    type: Type.Support,
    power: null,
  })
  .set("shaken", {
    name: "Stinky",
    desc: "Target feels 2 [sprStatus,2]SHOOK (can't attack).",
    type: Type.Defence,
    power: null,
  })
  .set("sting", {
    name: "Sting",
    desc: "Target feels 2 [sprStatus,10]TIRED (only basic actions). -20 STAMINA.",
    type: Type.Defence,
    power: null,
  })
  .set("stress", {
    name: "Frazzle",
    desc: "Target feels 1 [sprStatus,12]STRESSED (becomes [sprStatus,10]).",
    type: Type.Defence,
    power: null,
  })
  .set("allnervous", {
    name: "Upsetting Comment",
    desc: "Only used from net. Every fielded player feels 1 [sprStatus,0]NERVOUS (can't move).",
    type: Type.Defence,
    power: null,
  })
  .set("noisytag", {
    name: "Dramatic Exit",
    desc: "TAG OUT. Benched ally feels 1 [sprStatus,3]NOISY (draws attacks) + 2 [sprStatus,1]ANGRY (can't use support).",
    type: Type.Defence,
    power: null,
  })
  .set("distraction", {
    name: "Distraction",
    desc: "Only used from net. Feel 1 [sprStatus,3]NOISY (draws attacks).",
    type: Type.Defence,
    power: null,
  });
export default MOVE_DATA;
