const abilities: { [key: string]: { name: string; desc: string } } = {
  regenerator: {
    name: "Scavenger",
    desc: "Restore 20 STAMINA when tagged out",
  },
  fieldclear: {
    name: "Cleanup",
    desc: "Clears FIELD EFFECTS when tagged out",
  },
  starter_b: {
    name: "Power Up",
    desc: "[sprIcon,0]Attacks are 50% stronger when STAMINA is below 34",
  },
  lifeorb: {
    name: "Overwork",
    desc: "Attacks are 30% stronger, but cost 10 STAMINA",
  },
  starter_h: {
    name: "High Spirits",
    desc: "[sprIcon,1]Attacks are 50% stronger when STAMINA is below 34",
  },
  allyheal: {
    name: "Rumpus",
    desc: "Restores 6 STAMINA to ally each turn",
  },
  starter_m: {
    name: "Full Focus",
    desc: "[sprIcon,2]Attacks are 50% stronger when STAMINA is below 34",
  },
  fwdpass: {
    name: "Captain",
    desc: "When they volley, SHIFTs ally to the net",
  },
  empath: {
    name: "Stirring",
    desc: "Reflects negative FEELINGs back onto enemies",
  },
  defiant_h: {
    name: "Defiant",
    desc: "[sprIcon,1]Pow[sprBoost,1] when stats are lowered",
  },
  crowddef: {
    name: "Performer",
    desc: "When field has RALLY, [sprIcon,0][sprIcon,1][sprIcon,2]DEF +25%",
  },
  moldbreaker: {
    name: "Maverick",
    desc: "Ball attacks ignore traits",
  },
  unmarked: {
    name: "Flitting",
    desc: "Can't be [sprStatus,9]BLOCKED",
  },
  fetch: {
    name: "Fetch",
    desc: "Feels [sprStatus,8]JAZZED (POW x1.5) after recieving any attack",
  },
  watcher: {
    name: "Watchtower",
    desc: "Recieves attacks in place of adjacent allies",
  },
  prankster: {
    name: "Mischief",
    desc: "Can use [sprIcon,4]SUPPORT plays during Defense",
  },
  handsfree: {
    name: "No-Hands",
    desc: "Can use [sprIcon,4]SUPPORT plays while holding ball",
  },
  nimble: {
    name: "Nimble",
    desc: "+1 ACTION after recieving any attack",
  },
  lightningrod_m: {
    name: "Neural Net",
    desc: "Is a magnet for all [spricon,2] attacks",
  },
  spiker: {
    name: "Spiker",
    desc: "Net attacks get additional +20% POW",
  },
  friendguard: {
    name: "Friendship",
    desc: "Ally takes 25% less damage",
  },
  cheer: {
    name: "Cheerleader",
    desc: "Ally attacks do +10 damage",
  },
  static: {
    name: "Unpredictable",
    desc: "When recieving an attack, attacker feels 1 [sprStatus,0]NERVOUS (can't move)",
  },
  avenger: {
    name: "Avenger",
    desc: "Attacks are 1.50x stronger while any ally is [sprStatus,5]WIPED",
  },
  defender: {
    name: "Guardian",
    desc: "Defences are 1.50x stronger while any ally is [sprStatus,5]WIPED",
  },
  heavy: {
    name: "Heavy",
    desc: "Can't be forced to move by opponents",
  },
  multiscale: {
    name: "Armored",
    desc: "DEF +50% when STAMINA is 100",
  },
  trust: {
    name: "Trusting",
    desc: "+1 to any [sprBoost,2]BOOSTs recieved from allies",
  },
  technician: {
    name: "Crafty",
    desc: "Moves with 60POW or less are 50% stronger",
  },
  study: {
    name: "Study",
    desc: "After recieving any [sprIcon,0][sprIcon,1][sprIcon,2]attack, [sprBoost,0]BOOSTs the corresponding DEF",
  },
  freemove: {
    name: "Jet",
    desc: "Gets +1 ACTION after MOVE",
  },
  intimidate: {
    name: "Majesty",
    desc: "[sprIcon,1]Pow[sprBoost,3] to opponent team when tagged in",
  },
};

export default abilities;
