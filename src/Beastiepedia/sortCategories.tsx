import { BeastieType } from "../data/BeastieData";

type StatType = "ba" | "bd" | "ha" | "hd" | "ma" | "md";

const STATS: StatType[] = ["ba", "bd", "ha", "hd", "ma", "md"];
const POW_STATS: StatType[] = ["ba", "ha", "ma"];

const STAT_IMGS: Record<StatType, React.ReactElement> = {
  ba: <img key="ba" src="/gameassets/sprIcon/0.png" alt="Body POW" />,
  bd: <img key="bd" src="/gameassets/sprIcon/0.png" alt="Body DEF" />,
  ha: <img key="ha" src="/gameassets/sprIcon/1.png" alt="Spirit POW" />,
  hd: <img key="hd" src="/gameassets/sprIcon/1.png" alt="Spirit DEF" />,
  ma: <img key="ma" src="/gameassets/sprIcon/2.png" alt="Mind POW" />,
  md: <img key="md" src="/gameassets/sprIcon/2.png" alt="Mind DEF" />,
};

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

function StatText({
  beastie,
  stats,
}: {
  beastie: BeastieType;
  stats: StatType[];
}) {
  return (
    <>
      {stats.map((stat) => STAT_IMGS[stat])}
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
    compare: (beastie1, beastie2) => {
      const [[stat1], val1] = getMaxStat(beastie1);
      const [[stat2], val2] = getMaxStat(beastie2);
      return val1 - val2 || stat2.localeCompare(stat1);
    },
    display: (beastie) => (
      <StatText beastie={beastie} stats={getMaxStat(beastie)[0]} />
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
