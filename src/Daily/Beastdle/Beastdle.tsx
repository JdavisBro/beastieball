import styles from "./Beastdle.module.css";
import BeastieSelect from "../../shared/BeastieSelect";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import BEASTIE_DATA from "../../data/BeastieData";
import BeastieGuess from "./BeastieGuess";
import { useDaily } from "../dailyShared";

export const TYPES = [
  { name: "Body", char: "b", image: 0 },
  { name: "Spirit", char: "h", image: 1 },
  { name: "Mind", char: "m", image: 2 },
];

export default function Beastdle() {
  const {
    setSeed,
    resetSeed,
    isDaily,
    target,
    correct,
    guesses,
    handleGuess,
    resetDate,
  } = useDaily("beastdleDailyGuesses", 83457513);

  return (
    <>
      <OpenGraph
        title={`Beastdle - ${import.meta.env.VITE_BRANDING}`}
        image="gameassets/sprMainmenu/25.png"
        url="daily/beastdle/"
        description="Beastieball Beastie Guessing Game!"
      />
      <Header
        title="Beastdle"
        returnButtonTo="/daily/"
        returnButtonTitle="Beastieball.info Daily Menu"
      />
      <div className={styles.container}>
        Guess a beastie and the table will show how that guessed beastie
        compares to the target beastie
        <div className={styles.help}>
          <div className={styles.guessSectionWrong}>
            Red: Guessed beastie's data does not match targets
          </div>
          <div className={styles.guessSectionMaybe}>
            Orange: Guessed beastie's data partially matches targets
          </div>
          <div className={styles.guessSection}>
            Green: Guessed beastie's data completely matches targets
          </div>
          <div className={styles.guessSectionBlank}>
            <img src="/gameassets/sprBoost/0.png" alt="Up" /> Up Arrow: The
            target's stat is greater than this beastie's
          </div>
          <div className={styles.guessSectionBlank}>
            <img src="/gameassets/sprBoost/3.png" alt="Down" /> Down Arrow: The
            target's stat is less than this beastie's
          </div>
        </div>
        <span>
          <button onClick={resetSeed} disabled={isDaily}>
            Daily
          </button>
          <button onClick={() => setSeed(Math.random(), true)}>Random</button>
        </span>
        {isDaily ? (
          <>
            <span>
              Daily:{" "}
              {new Date(
                new Date().toUTCString().replace(" GMT", ""),
              ).toDateString()}
            </span>
            <span>
              New at: {String(resetDate.getHours()).padStart(2, "0")}:
              {String(resetDate.getMinutes()).padStart(2, "0")}
            </span>
          </>
        ) : null}
        Guesses: {guesses.length}
        <span>
          {correct ? (
            "Yay!"
          ) : (
            <>
              <BeastieSelect
                beastieId={undefined}
                setBeastieId={handleGuess}
                hashName="Guess"
                textOverride="Select Beastie"
              />
              <button onClick={() => handleGuess(target.id)} disabled={correct}>
                Give Up
              </button>
            </>
          )}
        </span>
        <div className={styles.guessesContainer}>
          <table className={styles.guesses}>
            <thead>
              <tr>
                <th>Guess #</th>
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
                <th>Metamorphs</th>
                <th>Lvl 100 Exp</th>
                <th>Ally Training</th>
              </tr>
            </thead>
            <tbody>
              {guesses.map((beastieId, index) => (
                <BeastieGuess
                  key={beastieId}
                  num={guesses.length - index}
                  beastie={BEASTIE_DATA.get(beastieId)}
                  target={target}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
