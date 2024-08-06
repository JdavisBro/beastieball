import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Shared.module.css";
import MoveModalContext from "./MoveModalContext";
import BEASTIE_DATA from "../data/Beastiedata";
import { LEARN_SETS } from "../data/Learnsets";
import { Move } from "../data/MoveData";

export default function MoveModalProvider(props: PropsWithChildren) {
  const [move, setMove] = useState<null | Move>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      if (move) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  });

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
      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target == dialogRef.current) {
            setMove(null);
          }
        }}
      >
        <h4>Beasties That Learn {move?.name}</h4>
        <div className={styles.movebeastielist}>
          {levelBeasties.length ? "From Level" : ""}
          {levelBeasties.map((name) => (
            <>
              <Link
                to={`/beastiepedia/${name[0]}`}
                key={name[0]}
                onClick={() => dialogRef.current?.close()}
              >
                <img src={`/icons/${name[0]}.png`} />
                {name[0]} - {name[1]}
              </Link>
            </>
          ))}
        </div>
        {levelBeasties.length && friendBeasties.length ? <br /> : null}
        <div className={styles.movebeastielist}>
          {friendBeasties.length ? "From Friends" : ""}
          {friendBeasties.map((name) => (
            <>
              <Link
                to={`/beastiepedia/${name}`}
                key={name}
                onClick={() => dialogRef.current?.close()}
              >
                <img src={`/icons/${name}.png`} />
                {name}
              </Link>
            </>
          ))}
        </div>
      </dialog>
      {props.children}
    </MoveModalContext.Provider>
  );
}
