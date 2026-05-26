import { useState } from "react";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";

export const SORTED_BEASTIES = Array.from(BEASTIE_DATA.values()).sort(
  (a, b) => a.order - b.order,
);

const RNG_M = 0x80000000;
const RNG_A = 1103515245;
const RNG_C = 12345;

export function getDaySeed() {
  const date = new Date();
  return Number(
    String(date.getUTCFullYear()) +
      String(date.getUTCMonth()) +
      String(date.getUTCDate()),
  );
}

export function getRng(seed: number, seedOffset: number) {
  return ((RNG_A * (seed + seedOffset) + RNG_C) % RNG_M) / RNG_M;
}

export function getDailyGuesses(key: string): string[] {
  const seed = getDaySeed();
  const data_str = localStorage.getItem(key);
  if (!data_str) return [];
  const data = JSON.parse(data_str);
  if (!Array.isArray(data)) return [];
  const data_seed = data[0];
  const data_array = data[1];
  if (
    data_seed != seed ||
    !Array.isArray(data_array) ||
    data_array.some(
      (id) => typeof id != "string" || !(!id.length || BEASTIE_DATA.has(id)),
    )
  )
    return [];
  return data_array;
}

export function setDailyGuesses(key: string, seed: number, data: string[]) {
  localStorage.setItem(key, JSON.stringify([seed, data]));
}

type DailyType = {
  seed: number;
  setSeed: (seed: number, percent?: boolean) => void;
  resetSeed: () => void;
  isDaily: boolean;
  target: BeastieType;
  correct: boolean;
  guesses: string[];
  handleGuess: (beastie?: string) => void;
  resetDate: Date;
};

export function useDaily(storageKey: string, seedOffset: number): DailyType {
  const [seed, setSeed] = useState(getDaySeed());
  const isDaily = seed == getDaySeed();

  const target =
    SORTED_BEASTIES[
      Math.floor(getRng(seed, seedOffset) * SORTED_BEASTIES.length)
    ];

  const [guesses, setGuesses] = useState<string[]>(
    isDaily ? getDailyGuesses(storageKey) : [],
  );
  const correct = guesses.includes(target.id);

  const handleSetSeed = (seed: number, percent?: boolean) => {
    if (percent) seed = Math.floor(RNG_M * seed);
    setSeed(seed);
    setGuesses(seed == getDaySeed() ? getDailyGuesses(storageKey) : []);
  };

  const handleGuess = (beastieId: string | undefined) => {
    if (
      beastieId !== undefined &&
      (!beastieId.length || !guesses.includes(beastieId))
    ) {
      setGuesses((guesses) => {
        if (beastieId.length && guesses.includes(beastieId)) return guesses;
        const newGuesses = [beastieId, ...guesses];
        if (seed == getDaySeed()) setDailyGuesses(storageKey, seed, newGuesses);
        return newGuesses;
      });
    }
  };
  const resetDate = new Date();
  resetDate.setUTCDate(resetDate.getUTCDate() + 1);
  resetDate.setUTCHours(0);
  resetDate.setUTCMinutes(0);

  return {
    seed,
    setSeed: handleSetSeed,
    resetSeed: () => handleSetSeed(getDaySeed()),
    isDaily,
    target,
    correct,
    guesses,
    handleGuess,
    resetDate,
  };
}
