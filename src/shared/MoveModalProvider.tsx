import { PropsWithChildren, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Shared.module.css";
import MoveModalContext from "./MoveModalContext";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { Move } from "../data/MoveData";
import Modal from "./Modal";
import MoveView from "./MoveView";
import { useIsSpoiler } from "./useSpoiler";
import useScreenOrientation from "../utils/useScreenOrientation";
import useLocalization from "../localization/useLocalization";

export default function MoveModalProvider(props: PropsWithChildren) {
  const { L, getLink } = useLocalization();

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

  const [isSpoilerFn, setSeen] = useIsSpoiler();

  const handleClick = (spoilerBeastie: string | undefined = undefined) => {
    if (!spoilerBeastie) {
      return setMove(null);
    }
    setSeen(spoilerBeastie);
  };

  const orientation = useScreenOrientation(800);

  const moveName = move && L(move.name);

  return (
    <MoveModalContext.Provider value={setMove}>
      <Modal
        header={L("common.moveModal.title", { name: moveName ?? "" })}
        open={move != null}
        onClose={() => setMove(null)}
        hashValue="Play"
      >
        <div className={styles.movemodalview}>
          {move ? <MoveView move={move} noLearner={true} /> : null}
          <div className={styles.movebeastietitle}>
            <div>{levelBeasties.length ? L("common.moveModal.level") : ""}</div>
            <div>
              {friendBeasties.length ? L("common.moveModal.friends") : ""}
            </div>
          </div>
          <div className={styles.movebeastierow}>
            <div className={styles.movebeastielist}>
              {levelBeasties.map((beastie) => {
                const isSpoiler = isSpoilerFn(beastie[0].id);
                const beastieName = L(beastie[0].name);
                return (
                  <Link
                    to={
                      isSpoiler
                        ? "#Play"
                        : getLink(
                            `/beastiepedia/${beastieName}?play=${moveName}`,
                          )
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
                          : `/icons/${L(beastie[0].name, undefined, true)}.png`
                      }
                      style={
                        isSpoiler ? { filter: "brightness(50%)" } : undefined
                      }
                    />
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {L(
                        orientation
                          ? "common.moveModal.levelFormatMobile"
                          : "common.moveModal.levelFormat",
                        {
                          beastie: isSpoiler
                            ? L("common.beastieNum", {
                                num: String(beastie[0].number),
                              })
                            : beastieName,
                          level: String(beastie[1]),
                        },
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className={styles.movebeastielist}>
              {friendBeasties.map((beastie) => {
                const isSpoiler = isSpoilerFn(beastie.id);
                const beastieName = L(beastie.name);
                return (
                  <Link
                    to={
                      isSpoiler
                        ? "#Play"
                        : getLink(`/beastiepedia/${beastieName}`)
                    }
                    key={beastie.id}
                    onClick={() =>
                      handleClick(isSpoiler ? beastie.id : undefined)
                    }
                  >
                    <img
                      src={
                        isSpoiler
                          ? "/gameassets/sprExclam_1.png"
                          : `/icons/${L(beastie.name, undefined, true)}.png`
                      }
                      style={
                        isSpoiler ? { filter: "brightness(50%)" } : undefined
                      }
                    />
                    {isSpoiler
                      ? L("common.beastieNum", {
                          num: String(beastie.number),
                        })
                      : beastieName}
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
