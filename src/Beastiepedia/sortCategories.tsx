import { BeastieType } from "../data/BeastieData";
import { LocalizationFunction } from "../localization/useLocalization";

type StatType = "ba" | "bd" | "ha" | "hd" | "ma" | "md";

const STATS: StatType[] = ["ba", "bd", "ha", "hd", "ma", "md"];
const POW_STATS: StatType[] = ["ba", "ha", "ma"];

const STAT_MAP: Record<StatType, { src: string; altKey: string }> = {
  ba: { src: "/gameassets/sprIcon/0.png", altKey: "common.types.bodyPow" },
  bd: { src: "/gameassets/sprIcon/0.png", altKey: "common.types.bodyDef" },
  ha: { src: "/gameassets/sprIcon/1.png", altKey: "common.types.spiritPow" },
  hd: { src: "/gameassets/sprIcon/1.png", altKey: "common.types.spiritDef" },
  ma: { src: "/gameassets/sprIcon/2.png", altKey: "common.types.mindPow" },
  md: { src: "/gameassets/sprIcon/2.png", altKey: "common.types.mindDef" },
};

type SortValueType = {
  name: string;
  value: (beastie: BeastieType, L: LocalizationFunction) => number;
  compare?: undefined;
  display?: (
    beastie: BeastieType,
    grid: boolean,
    L: LocalizationFunction,
  ) => React.ReactNode | undefined; // undefined = use value result, return value undefined: no show
};

type SortCompareType = Omit<SortValueType, "value" | "compare"> & {
  value: (beastie: BeastieType, L: LocalizationFunction) => string | number;
  compare: (
    beastie1: BeastieType,
    beastie2: BeastieType,
    L: LocalizationFunction,
  ) => number;
};

type SortType = SortValueType | SortCompareType;

const NUMBER_FORMAT = Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

function StatText({
  beastie,
  stats,
  L,
}: {
  beastie: BeastieType;
  stats: StatType[];
  L: LocalizationFunction;
}) {
  return (
    <>
      {stats.map((stat) => {
        const { src, altKey } = STAT_MAP[stat];
        return <img key={stat} src={src} alt={L(altKey)} />;
      })}
      {beastie[stats[0]]}
    </>
  );
}

function getMaxStat(beastie: BeastieType): [StatType[], number] {
  const statNum = Math.max(beastie.ba, beastie.ha, beastie.ma);
  return [POW_STATS.filter((a) => beastie[a] == statNum), statNum];
}

export const SORT_CATEGORIES: SortType[] = [
  {
    name: "number",
    value: (beastie) => beastie.number,
    display: () => undefined,
  },
  {
    name: "name",
    value: (beastie, L) => L(beastie.name),
    compare: (beastie1, beastie2, L) =>
      L(beastie1.name).localeCompare(L(beastie2.name)),
    display: (beastie, grid, L) => (grid ? L(beastie.name) : undefined),
  },

  {
    name: "totalStats",
    value: (beastie) => STATS.reduce((accum, stat) => accum + beastie[stat], 0),
  },
  {
    name: "totalPow",
    value: (beastie) => beastie.ba + beastie.ha + beastie.ma,
  },
  {
    name: "highestPow",
    value: (beastie) => Math.max(beastie.ba, beastie.ha, beastie.ma),
    compare: (beastie1, beastie2) => {
      const [[stat1], val1] = getMaxStat(beastie1);
      const [[stat2], val2] = getMaxStat(beastie2);
      return val1 - val2 || stat2.localeCompare(stat1);
    },
    display: (beastie, _, L) => (
      <StatText beastie={beastie} stats={getMaxStat(beastie)[0]} L={L} />
    ),
  },
  {
    name: "totalDef",
    value: (beastie) => beastie.bd + beastie.hd + beastie.md,
  },
  {
    name: "bodyPow",
    value: (beastie) => beastie.ba,
  },
  {
    name: "bodyDef",
    value: (beastie) => beastie.bd,
  },
  {
    name: "spiritPow",
    value: (beastie) => beastie.ha,
  },
  {
    name: "spiritDef",
    value: (beastie) => beastie.hd,
  },
  {
    name: "mindPow",
    value: (beastie) => beastie.ma,
  },
  {
    name: "mindDef",
    value: (beastie) => beastie.md,
  },
  {
    name: "recruit",
    value: (beastie) =>
      beastie.recruit_value != 0.5 ? beastie.recruit_value : 0,
    display: (beastie) =>
      NUMBER_FORMAT.format(
        beastie.recruit_value != 0.5 ? beastie.recruit_value : 0,
      ),
  },
  {
    name: "development",
    value: (beastie) => beastie.anim_progress,
    display: (beastie) => beastie.anim_progress + "%",
  },
];
