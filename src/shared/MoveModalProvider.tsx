import { PropsWithChildren, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Shared.module.css";
import MoveModalContext from "./MoveModalContext";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { Move } from "../data/MoveData";
import Modal from "./Modal";
import MoveView from "./MoveView";
import { SpoilerMode, useSpoilerMode, useSpoilerSeen } from "./useSpoiler";
import useScreenOrientation from "../utils/useScreenOrientation";

export default function MoveModalProvider(props: PropsWithChildren) {
  const [move, setMove] = useState<null | Move>(null);

  const levelBeasties: [BeastieType, number][] = [];
  const friendBeasties: BeastieType[] = [];
  if (move) {
    BEASTIE_DATA.forEach((beastie) => {
      const learnLevel = beastie.learnset.find(
        ([, moveid]) => (moveid as string) == move.id,
      );
      if (learnLevel) {
        levelBeasties.push([beastie, (learnLevel[0] as number) || 1]);
      } else if (beastie.attklist.includes(move.id)) {
        friendBeasties.push(beastie);
      }
    });
  }

  const [spoilerMode] = useSpoilerMode();
  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();

  const handleClick = (spoilerBeastie: string | undefined = undefined) => {
    if (!spoilerBeastie) {
      return setMove(null);
    }
    seenBeasties[spoilerBeastie] = true;
    setSeenBeasties(seenBeasties);
  };

  const orientation = useScreenOrientation(800);
  const levelSeparator = orientation ? <br /> : " - ";

  return (
    <MoveModalContext.Provider value={setMove}>
      <Modal
        header={`Play: ${move?.name}`}
        open={move != null}
        onClose={() => setMove(null)}
        hashValue="Play"
      >
        <div className={styles.movemodalview}>
          {move ? <MoveView move={move} noLearner={true} /> : null}
          <div className={styles.movebeastietitle}>
            <div>{levelBeasties.length ? "From Level" : ""}</div>
            <div>{friendBeasties.length ? "From Friends" : ""}</div>
          </div>
          <div className={styles.movebeastierow}>
            <div className={styles.movebeastielist}>
              {levelBeasties.map((beastie) => {
                const isSpoiler =
                  spoilerMode == SpoilerMode.OnlySeen &&
                  !seenBeasties[beastie[0].id];
                return (
                  <Link
                    to={
                      isSpoiler
                        ? "#Play"
                        : `/beastiepedia/${beastie[0].name}?play=${move?.name}`
                    }
                    key={beastie[0].id}
                    onClick={() =>
                      handleClick(isSpoiler ? beastie[0].id : undefined)
                    }
                  >
                    <img
                      src={
                        isSpoiler
                          ? "/gameassets/sprExclam_1.png"
                          : `/icons/${beastie[0].name}.png`
                      }
                      style={
                        isSpoiler ? { filter: "brightness(50%)" } : undefined
                      }
                    />
                    <div>
                      {isSpoiler
                        ? `Beastie #${beastie[0].number}`
                        : beastie[0].name}
                      {levelSeparator}
                      {beastie[1]}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className={styles.movebeastielist}>
              {friendBeasties.map((beastie) => {
                const isSpoiler =
                  spoilerMode == SpoilerMode.OnlySeen &&
                  !seenBeasties[beastie.id];
                return (
                  <Link
                    to={isSpoiler ? "#Play" : `/beastiepedia/${beastie.name}`}
                    key={beastie.id}
                    onClick={() =>
                      handleClick(isSpoiler ? beastie.id : undefined)
                    }
                  >
                    <img
                      src={
                        isSpoiler
                          ? "/gameassets/sprExclam_1.png"
                          : `/icons/${beastie.name}.png`
                      }
                      style={
                        isSpoiler ? { filter: "brightness(50%)" } : undefined
                      }
                    />
                    {isSpoiler ? `Beastie #${beastie.number}` : beastie.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      {props.children}
    </MoveModalContext.Provider>
  );
}
