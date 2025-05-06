type HoverTooltip = {
  id: string;
  title: string;
  desc: string;
  trigger?: RegExp;
};

export const HOVER_TOOLTIPS: Record<string, HoverTooltip> = {
  test: {
    id: "test",
    title: "Test Tooltip",
    desc: "Test Dialogue Tooltip for Testing Things. e.g: [sprIcon,0]POW[sprBoost,2]",
  },
  tired: {
    id: "tired",
    title: "TIRED feeling",
    desc: "[sprStatus,10]TIRED beastie mean beasite bad cannot move!! cannot do stuff!! some more information about this: uhhhh",
    trigger: /\[sprStatus,10\]TIRED( \(only basic actions\))?/g,
  },
  wiped: {
    id: "wiped",
    title: "WIPED feeling",
    desc: "BEASTIE DEAD. MUST HOLD BEASITE FUNERAL BEFORE CONTINUING GAME.",
    trigger: /\[sprStatus,5\]WIPED( \(must bench\))?/g,
  },
};

export const HOVER_TOOLTIPS_ARRAY = Object.values(HOVER_TOOLTIPS);
