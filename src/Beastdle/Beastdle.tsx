import styles from "./Beastdle.module.css";
import BeastieSelect from "../shared/BeastieSelect";
import Header from "../shared/Header";
import OpenGraph from "../shared/OpenGraph";
import BEASTIE_DATA from "../data/BeastieData";
import { useState } from "react";
import BeastieGuess from "./BeastieGuess";

const RNG_M = 0x80000000;
const RNG_A = 1103515245;
const RNG_C = 12345;

export const TYPES = [
  { name: "Body", char: "b", image: 0 },
  { name: "Spirit", char: "h", image: 1 },
  { name: "Mind", char: "m", image: 2 },
];

function getDaySeed() {
  const date = new Date();
  return Number(
    String(date.getUTCFullYear()) +
      String(date.getUTCMonth()) +
      String(date.getUTCDate()),
  );
}

export default function Beastdle() {
  const [seed, setSeed] = useState(getDaySeed());

  const target = Array.from(BEASTIE_DATA.values())[
    Math.floor(
      (((RNG_A * Number(seed) + RNG_C) % RNG_M) / RNG_M) * BEASTIE_DATA.size,
    )
  ];

  const [guesses, setGuesses] = useState<string[]>([]);
  const correct = guesses.includes(target.id);

  const guess = (beastieId: string | undefined) => {
    if (beastieId && !guesses.includes(beastieId)) {
      setGuesses([...guesses, beastieId]);
    }
  };

  return (
    <>
      <OpenGraph
        title={`Beastdle - ${import.meta.env.VITE_BRANDING}`}
        image="gameassets/sprMainmenu/25.png"
        url="beastdle/"
        description="Beastieball Beastie Guessing Game!"
      />
      <Header title="Beastdle" />
      <div className={styles.container}>
        <button
          onClick={() => {
            setSeed(getDaySeed());
            setGuesses([]);
          }}
          disabled={seed == getDaySeed()}
        >
          Daily
        </button>
        <button
          onClick={() => {
            setSeed(Math.random() * 100000);
            setGuesses([]);
          }}
        >
          Random
        </button>
        <h1>Guess The Beastie!</h1>
        {correct ? (
          ""
        ) : (
          <BeastieSelect
            beastieId={undefined}
            setBeastieId={guess}
            textOverride="Select Beastie"
          />
        )}
        Guesses: {guesses.length}
        <button
          onClick={() => setGuesses([...guesses, target.id])}
          disabled={correct}
        >
          Give Up
        </button>
        <table className={styles.guesses}>
          <thead>
            <tr>
              <th>Name</th>
              {TYPES.map((type) => (
                <th key={type.name}>
                  <img
                    src={`/gameassets/sprIcon/${type.image}.png`}
                    alt={type.name}
                  />
                  POW
                </th>
              ))}
              {TYPES.map((type) => (
                <th key={type.name}>
                  <img
                    src={`/gameassets/sprIcon/${type.image}.png`}
                    alt={type.name}
                  />
                  DEF
                </th>
              ))}
              <th>Metamorphs Into A Beastie</th>
              <th>Lvl 100 Exp</th>
              <th>Ally Training</th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((beastieId) => (
              <BeastieGuess
                key={beastieId}
                beastie={BEASTIE_DATA.get(beastieId)}
                target={target}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
