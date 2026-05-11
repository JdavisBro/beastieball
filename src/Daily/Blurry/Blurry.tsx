import styles from "./Blurry.module.css";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import { useMemo } from "react";
import { getRng, useDaily } from "../dailyShared";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import { BeastieImage } from "../../shared/beastieRender/BeastieImage";
import { RenderBeastieType } from "../../shared/beastieRender/BeastieRenderContext";
import BeastieSelect from "../../shared/BeastieSelect";
import BEASTIE_DATA from "../../data/BeastieData";
import useLocalization from "../../localization/useLocalization";

const SEED_OFFSET = 8107733;

const preventDefault: React.ReactEventHandler<Element> = (event) => {
  event.preventDefault();
};

const colorAltMap: ("colors" | "shiny" | "colors2")[] = [
  "colors",
  "shiny",
  "colors2",
];

export default function Blurry() {
  const { L } = useLocalization();

  const {
    seed,
    setSeed,
    resetSeed,
    isDaily,
    target,
    correct,
    guesses,
    handleGuess,
    resetDate,
  } = useDaily("blurryDailyGuesses", SEED_OFFSET);

  const drawBeastie: RenderBeastieType = useMemo(() => {
    const colorAlts = target.colors2 ? 3 : 2;
    const colorAlt = Math.floor(getRng(seed, SEED_OFFSET + 1) * colorAlts);
    const spriteAlts = 1 + target.spr_alt.length;
    const spriteAlt = Math.floor(getRng(seed, SEED_OFFSET + 2) * spriteAlts);
    const colors = [...new Array(target.colors.length).keys()].map((index) =>
      getRng(seed, SEED_OFFSET + 10 + index),
    );
    return {
      id: target.id,
      colors,
      colorAlt: colorAltMap[colorAlt],
      sprAlt: spriteAlt,
    };
  }, [target]);

  const blurNum = correct ? 0 : Math.max(10, 80 - 10 * guesses.length);

  return (
    <>
      <OpenGraph
        title={`Blurry - ${import.meta.env.VITE_BRANDING}`}
        image="gameassets/sprMainmenu/29.png"
        url="daily/blurry/"
        description="Blurry Beastie Guessing Game"
      />
      <Header
        title="Blurry"
        returnButtonTo="/daily/"
        returnButtonTitle="Beastieball.info Daily Menu"
      />
      <div className={styles.container}>
        <BeastieRenderProvider>
          <div
            style={{ filter: `blur(${blurNum}px)` }}
            className={styles.imageContainer}
            onContextMenu={preventDefault}
          >
            <BeastieImage
              key={seed}
              defaultUrl="/gameassets/sprMainmenu/29.png"
              beastie={drawBeastie}
              className={styles.beastieImage}
              loadingClassName={styles.beastieImageLoading}
              alt=""
            />
          </div>
        </BeastieRenderProvider>
        <span>
          <button onClick={() => resetSeed()} disabled={isDaily}>
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
        {correct ? (
          <div>🎉🎉congrats🎉🎉</div>
        ) : (
          <div>
            <BeastieSelect
              beastieId={undefined}
              setBeastieId={handleGuess}
              hashName="Guess"
              textOverride="Select Beastie"
            />
            <button onClick={() => handleGuess("")}>Skip</button>
          </div>
        )}
        <div className={styles.guesses}>
          {guesses.map((guess, index) => {
            const beastie = BEASTIE_DATA.get(guess);
            if (!beastie)
              return (
                <div key={"skip" + index} className={styles.guess}>
                  Skip
                </div>
              );
            return (
              <div
                key={guess}
                className={
                  guess == target.id ? styles.correctGuess : styles.guess
                }
              >
                <img src={`/icons/${L(beastie.name, undefined, true)}.png`} />
                {L(beastie.name ?? "")}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
