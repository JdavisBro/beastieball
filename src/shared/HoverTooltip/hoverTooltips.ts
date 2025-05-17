type HoverTooltip = {
  id: string;
  title: string;
  desc: string;
};

type HoverMatcher = {
  trigger: RegExp;
  match: (match: string, ...groups: string[]) => string;
};

const makeDefaultMatch: (id: string) => (match: string) => string =
  (id) => (match) =>
    `[tt,${id}]${match}[/tt]`;

export const HOVER_MATCHERS: HoverMatcher[] = [
  {
    trigger: /\[sprStatus,\d+\](\p{L}+)( \(.+?\))?/gu,
    match: (match, ...groups) => {
      const feeling = groups[0].toLowerCase();
      // if (!(feeling in HOVER_TOOLTIPS)) {
      //   return match;
      // }
      if (feeling == "stressed" && groups[1]) {
        return "[tt,stressed][sprStatus,12]STRESSED (becomes [tt,tired][sprStatus,10]TIRED[tt,stressed])[/tt]";
      }
      return `[tt,${feeling}]${match}[/tt]`;
    },
  },
  {
    trigger: /TRAP( \(.+?\))?/g,
    match: makeDefaultMatch("trap"),
  },
  {
    trigger: /RALLY( \(.+?\))?/g,
    match: makeDefaultMatch("rally"),
  },
  {
    trigger: /RHYTHM( \(.+?\))?/g,
    match: makeDefaultMatch("rhythm"),
  },
  {
    trigger: /DREAD( \(.+?\))?/g,
    match: makeDefaultMatch("dread"),
  },
  {
    trigger: /QUAKE( \(.+?\))?/g,
    match: makeDefaultMatch("quake"),
  },
  {
    trigger: /WALL/g,
    match: makeDefaultMatch("wall"),
  },
  {
    trigger: /FIELD EFFECTS/gi,
    match: makeDefaultMatch("fieldeffects"),
  },
  {
    trigger: /(good |bad |negative )?FEELINGS?/gi,
    match: makeDefaultMatch("feelings"),
  },
];

export const HOVER_TOOLTIPS: Record<string, HoverTooltip> = {
  test: {
    id: "test",
    title: "Test Tooltip",
    desc: "Test Dialogue Tooltip for Testing Things. e.g: [sprIcon,0]POW[sprBoost,2]. Innertooltip Texting: [tt,wiped][sprStatus,5]WIPED[/tt]",
  },
  wiped: {
    id: "wiped",
    title: "WIPED feeling",
    desc: `[sprStatus,5]WIPED Beasties can only use Free Ball.
Stacks decrease at the end of each Offense and Defense turn while the affected Beastie is on the bench (or is ROWDY).
[sprStatus,5]WIPED Beasties with enough STAMINA can still receive Attacks without losing the point.`,
  },
  sweaty: {
    id: "sweaty",
    title: "SWEATY feeling",
    desc: `At the end of a team's Offense turn, [sprStatus,6]SWEATY Beasties that're on the court lose 10 Stamina per stack of [sprStatus,6]SWEATY, and gain an additional stack of [sprStatus,6]SWEATY.
[sprStatus,6]SWEATY stacks do not decrease over time.
Attempting to reapply [sprStatus,6]SWEATY will increase the number of stacks, unless specified otherwise.`,
  },
  tired: {
    id: "tired",
    title: "TIRED feeling",
    desc: `[sprStatus,10]TIRED Beasties can only use the Move, Volley, Free Ball, and Tag Out Plays.
Stacks decrease by 1 at the end of each Offense and Defense turn.`,
  },
  stressed: {
    id: "stressed",
    title: "STRESSED feeling",
    desc: `[sprStatus,12]STRESSED stacks decrease at the end of every Offense and Defense turn.
Once [sprStatus,12]STRESSED stacks reach 0, the previously [sprStatus,12]STRESSED Beastie will feel 2 [tt,tired][sprStatus,10]TIRED[/tt].`,
  },
  rally: {
    id: "rally",
    title: "RALLY field effect",
    desc: `RALLY applies to both sides of the field.
While the field has RALLY, all Beastie's [sprIcon,1]POW is increased by +1 [tt,booststages]Boost Stage[/tt] (+50%) and all [sprIcon,2] damage is multiplied by ¾ (75%).
RALLY decreases at the end of every Offense and Defense turn, and can be stacked up to 6.`,
  },
  rhythm: {
    id: "rhythm",
    title: "RHYTHM field effect",
    desc: `RHYTHM can be applied to either side of the field individually.
While a side of the field has RHYTHM, all Beasties on that side heal 6 stamina at the end of each Offense and Defense turn and can't be made SWEATY, NERVOUS, STRESSED, or TIRED by opponent Beasties.
RHYTHM decreases at the end of every Offense and Defense turn, after healing, and can't be stacked.`,
  },
  quake: {
    id: "quake",
    title: "QUAKE field effect",
    desc: `QUAKE can be applied to either side of the field individually.
While a side of the field has QUAKE, Volleys on that side deal 25 damage to the receiving Beastie, while consuming a stack of QUAKE.
QUAKE stacks also decrease at the end of the side's Offense.
When setting QUAKE, stack count will only be changed if the new stack count is higher then the current count.`,
  },
  fieldeffects: {
    id: "fieldeffects",
    title: "FIELD EFFECTS",
    desc: `FIELD EFFECTS are special effects that can target a single side of, or both sides of, the field. There are 6 Field Effects:
[tt,trap]TRAP (Tag-ins lose 8 stamina per trap)[/tt]
[tt,rally]RALLY ([sprIcon,1]POW +50%, [sprIcon,2]POW x3/4)[/tt]
[tt,rhythm]RHYTHM (Healing and protection)[/tt]
[tt,dread]DREAD (No good feelings)[/tt]
[tt,quake]QUAKE (Volleys deal 25 damage)[/tt]
[tt,wall]WALL[/tt]`,
  },
  feelings: {
    id: "feelings",
    title: "FEELINGs",
    desc: `FEELINGs are effects on an individual Beastie. Each feeling has a counter which, for most FEELINGs, counts down every turn except for the turn that it was given on or turns where a point is scored.
Good FEELINGs:
[tt,noisy][sprStatus,3]NOISY (attracts attacks)[/tt] · [tt,tough][sprStatus,4]TOUGH (1/4 damage)[/tt] · [tt,jazzed][sprStatus,8]JAZZED (POW +50%)[/tt]
Bad FEELINGs:
[tt,nervous][sprStatus,0]NERVOUS (can't move)[/tt] · [tt,angry][sprStatus,1]ANGRY (only attacks)[/tt] · [tt,shook][sprStatus,2]SHOOK (can't attack)[/tt]
[tt,wiped][sprStatus,5]WIPED (must bench)[/tt] · [tt,sweaty][sprStatus,6]SWEATY (losing stamina)[/tt] · [tt,blocked][sprStatus,9]BLOCKED (POW x2/3)[/tt]
[tt,tired][sprStatus,10]TIRED (only basic actions)[/tt] · [tt,tender][sprStatus,11]TENDER (DEF x1/2)[/tt] · [tt,stressed][sprStatus,12]STRESSED (becomes [sprStatus,10]TIRED)[/tt]`,
  },
  booststages: {
    id: "booststages",
    title: "Boost Stages",
    desc: `BOOSTs, Beastie Position, [tt,fieldeffects]FIELD EFFECTs[/tt], and [tt,feelings]FEELINGs[/tt] influence Beastie's stats using Boost Stages. When a Boost Stage is positive, it multiplies the stat by (2 + stage)/2, when negative it multiplies stats by 2/(2-stage) (or 2 + stage as a positive).
Examples:
For a Beastie with [sprIcon,0]POW[sprBoost,0] (+1), that feels [sprStatus,8]JAZZED (+1), and is At Net (+1): [sprIcon,0]POW's Boost Stage is +3 and is multiplied by 5/2 or 250%.
For a Beastie with [sprIcon,2]DEF[sprBoost,5] (-3) and is in the Back Row (+1): [sprIcon,2]DEF's Boost Stage is -2 and is multiplied by 2/4 or 50%.
Boost Stages may not be shown directly on the Beastie's stats (except for BOOSTs and Position) but are used when calculating damage.`,
  },
};
