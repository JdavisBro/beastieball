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
    desc: `[sprStatus,10]TIRED Beasties can only use the Move, Free Ball, and Tag Out Plays.
Stacks decrease by 1 at the end of each Offense and Defense turn.`,
  },
  quake: {
    id: "quake",
    title: "QUAKE field effect",
    desc: `QUAKE applies to one side of the field.
While the field has QUAKE, Volleys on that side deal 25 damage to the receiving Beastie, while consuming a stack of QUAKE.
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
};
