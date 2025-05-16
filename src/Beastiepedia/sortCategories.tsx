import { BeastieType } from "../data/BeastieData";

type StatType = "ba" | "bd" | "ha" | "hd" | "ma" | "md";

const STATS: StatType[] = ["ba", "bd", "ha", "hd", "ma", "md"];
const POW_STATS: StatType[] = ["ba", "ha", "ma"];
const POW_STATS_SORTABLE: StatType[] = ["ba", "ha", "ma"];

type SortValueType = {
  name: string;
  value: (beastie: BeastieType) => number;
  compare?: undefined;
  display?: (beastie: BeastieType) => React.ReactNode | undefined; // undefined = use value result
  smallDisplay?: boolean;
};

type SortCompareType = Omit<SortValueType, "value" | "compare"> & {
  value: (beastie: BeastieType) => string | number;
  compare: (beastie1: BeastieType, beastie2: BeastieType) => number;
};

type SortType = SortValueType | SortCompareType;

const NUMBER_FORMAT = Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

function StatText({ beastie, stat }: { beastie: BeastieType; stat: StatType }) {
  return (
    <>
      <img src={`/gameassets/sprIcon/${POW_STATS.indexOf(stat)}.png`} />
      {beastie[stat]}
    </>
  );
}

function getMaxStat(beastie: BeastieType): StatType {
  return POW_STATS_SORTABLE.sort(
    (a, b) => beastie[b] - beastie[a] || a.localeCompare(b),
  )[0];
}

export const SORT_CATEGORIES: SortType[] = [
  {
    name: "Number",
    value: (beastie) => beastie.number,
    display: () => undefined,
  },
  {
    name: "Name",
    value: (beastie) => beastie.name,
    compare: (beastie1, beastie2) => beastie1.name.localeCompare(beastie2.name),
  },

  {
    name: "Stat Total",
    value: (beastie) => STATS.reduce((accum, stat) => accum + beastie[stat], 0),
  },
  {
    name: "POW Total",
    value: (beastie) => beastie.ba + beastie.ha + beastie.ma,
  },
  {
    name: "Highest POW",
    value: (beastie) => Math.max(beastie.ba, beastie.ha, beastie.ma),
    compare: (beastie1, beastie2) =>
      beastie1[getMaxStat(beastie1)] - beastie2[getMaxStat(beastie2)] ||
      getMaxStat(beastie2).localeCompare(getMaxStat(beastie1)),
    display: (beastie) => (
      <StatText beastie={beastie} stat={getMaxStat(beastie)} />
    ),
  },
  {
    name: "DEF Total",
    value: (beastie) => beastie.bd + beastie.hd + beastie.md,
  },
  {
    name: "Body POW",
    value: (beastie) => beastie.ba,
  },
  {
    name: "Body DEF",
    value: (beastie) => beastie.bd,
  },
  {
    name: "Spirit POW",
    value: (beastie) => beastie.ha,
  },
  {
    name: "Spirit DEF",
    value: (beastie) => beastie.hd,
  },
  {
    name: "Mind POW",
    value: (beastie) => beastie.ma,
  },
  {
    name: "Mind DEF",
    value: (beastie) => beastie.md,
  },
  {
    name: "Recruit $",
    value: (beastie) =>
      beastie.recruit_value != 0.5 ? beastie.recruit_value : 0,
    display: (beastie) =>
      NUMBER_FORMAT.format(
        beastie.recruit_value != 0.5 ? beastie.recruit_value : 0,
      ),
  },
  {
    name: "Dev %",
    value: (beastie) => beastie.anim_progress,
    display: (beastie) => beastie.anim_progress + "%",
  },
];
