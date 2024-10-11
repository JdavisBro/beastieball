import { PropsWithChildren, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Shared.module.css";
import MoveModalContext from "./MoveModalContext";
import BEASTIE_DATA from "../data/BeastieData";
import { LEARN_SETS } from "../data/Learnsets";
import { Move } from "../data/MoveData";
import Modal from "./Modal";
import MoveView from "./MoveView";

export default function MoveModalProvider(props: PropsWithChildren) {
  const [move, setMove] = useState<null | Move>(null);

  const levelBeasties: [string, number][] = [];
  const friendBeasties: string[] = [];
  if (move) {
    BEASTIE_DATA.forEach((beastie) => {
      const learnLevel = LEARN_SETS[beastie.learnset].find(
        (value) => value[0] == move.id,
      );
      if (learnLevel) {
        levelBeasties.push([beastie.name, learnLevel[1]]);
      } else if (beastie.attklist.includes(move.id)) {
        friendBeasties.push(beastie.name);
      }
    });
  }

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
        </div>
        <div className={styles.movebeastierow}>
          <div className={styles.movebeastielist}>
            {levelBeasties.length ? "From Level" : ""}
            {levelBeasties.map((name) => (
              <Link
                to={`/beastiepedia/${name[0]}`}
                key={name[0]}
                onClick={() => setMove(null)}
              >
                <img src={`/icons/${name[0]}.png`} />
                {name[0]} - {name[1]}
              </Link>
            ))}
          </div>
          {levelBeasties.length && friendBeasties.length ? <br /> : null}
          <div className={styles.movebeastielist}>
            {friendBeasties.length ? "From Friends" : ""}
            {friendBeasties.map((name) => (
              <Link
                to={`/beastiepedia/${name}`}
                key={name}
                onClick={() => setMove(null)}
              >
                <img src={`/icons/${name}.png`} />
                {name}
              </Link>
            ))}
          </div>
        </div>
      </Modal>
      {props.children}
    </MoveModalContext.Provider>
  );
}
