import BOSS_DATA from "../../data/BossData";

const BOSSES = Object.values(BOSS_DATA);

const LEVELBONUS_BRACKET = 6;
const LEVELBONUS_TAX = 0.08;

export default function getLevelBonus(
  scales: string = "redd",
  bosses_defeated: Record<string, boolean> = {},
) {
  let level_bonus = 0;
  const scales_boss = BOSS_DATA[scales];
  if (!scales_boss) {
    return 0;
  }
  const rank = bossRankProgress(bosses_defeated);
  const offset = scales_boss.scale_rank_start_offset;
  const min_rank = scales_boss.min_rank + offset;

  const prio: { value: number; sort: number }[] = [];
  let min_rank_defeated = -1;
  if (rank <= min_rank) {
    return level_bonus;
  }
  for (const boss of BOSSES) {
    if (bosses_defeated[boss.id]) {
      const levels = boss.levels;
      // difficulty stuff
      prio.push({ value: levels, sort: levels + 100 * boss.rank });
      min_rank_defeated = Math.max(min_rank_defeated, boss.min_rank);
    }
  }

  let bonuses = rank - min_rank;
  prio.sort((a, b) => b.sort - a.sort);

  while (bonuses > 0) {
    level_bonus += (prio.shift()?.value ?? 0) * Math.min(1, bonuses);
    bonuses -= 1;
  }

  const bracket_num = Math.ceil(level_bonus / LEVELBONUS_BRACKET);
  const friction_boost =
    Math.ceil((level_bonus + min_rank) / LEVELBONUS_BRACKET) - bracket_num;
  let final_level_bonus = 0;

  for (let i = 0; i < bracket_num; i++) {
    final_level_bonus +=
      Math.max(
        Math.min(level_bonus - i * LEVELBONUS_BRACKET, LEVELBONUS_BRACKET),
        0,
      ) *
      (1 - Math.min(1, (i + friction_boost) * LEVELBONUS_TAX));
  }
  level_bonus = final_level_bonus;

  if (min_rank_defeated > min_rank) {
    level_bonus +=
      scales_boss.levels *
      Math.sqrt(Math.min(Math.max(min_rank_defeated - min_rank, 0), 1));
  }

  return level_bonus;
}

function bossRankProgress(bosses_defeated: Record<string, boolean> = {}) {
  let wins = 0;
  let min_rank = -1;
  let wins_total = 0;

  for (const boss of BOSSES) {
    if (bosses_defeated[boss.id]) {
      min_rank = Math.max(min_rank, boss.min_rank);
      wins_total += 1;
    }
  }

  wins = min_rank;

  for (const boss of BOSSES) {
    if (bosses_defeated[boss.id] && boss.min_rank >= min_rank) {
      wins += boss.rank;
    }
  }

  return Math.max(wins_total, min_rank + 1, wins);
}
