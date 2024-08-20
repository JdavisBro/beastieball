import { useState } from "react";

import styles from "./ContentInfo.module.css";
import BEASTIE_DATA, { BeastieType } from "../../data/BeastieData";
import InfoBox from "../../shared/InfoBox";
import MoveView from "../../shared/MoveView";
import { MoveEffect } from "../../data/MoveData";
import BeastieSelect from "../../shared/BeastieSelect";

enum ComboType {
  Rivals,
  Partners,
  Support,
  Defense,
}

const UNCOMBINABLE_EFFECTS = [33];

export default function ComboMove({
  beastiedata,
}: {
  beastiedata: BeastieType;
}) {
  const beasties: React.ReactNode[] = [];
  BEASTIE_DATA.forEach((beastie) =>
    beasties.push(<option value={beastie.id}>{beastie.name}</option>),
  );

  const [type, setType] = useState<ComboType>(ComboType.Rivals);

  const [friendId, setFriendId] = useState<string | undefined>(undefined);
  const friend = friendId ? BEASTIE_DATA.get(friendId) : undefined;

  const pows: number[] = [];
  let target = 0;
  let use = 0;
  let moveType =
    type == ComboType.Partners ? 3 : type == ComboType.Defense ? 5 : 4;

  const effects: MoveEffect[] = [];

  const attks = [beastiedata.ba, beastiedata.ha, beastiedata.ma];
  if (type == ComboType.Rivals) {
    if (friend) {
      attks[0] += friend.ba;
      attks[1] += friend.ha;
      attks[2] += friend.ma;
    }
    moveType =
      attks[2] > attks[1] && attks[2] > attks[0]
        ? 2
        : attks[1] > attks[0]
          ? 1
          : 0;
  }
  (friend ? [beastiedata, friend] : [beastiedata])
    .sort((beastie, beastie2) => beastie.number - beastie2.number)
    .forEach((beastie) => {
      for (let i = 0; i < beastie.combos[type].length; i += 3) {
        const neweff = {
          eff: beastie.combos[type][i],
          targ: beastie.combos[type][i + 1],
          pow: beastie.combos[type][i + 2],
        };
        switch (neweff.eff) {
          case 49:
            target = neweff.pow;
            continue;
          case 50:
            pows.push(neweff.pow);
            continue;
          case 51:
            use = neweff.pow;
            continue;
        }
        let effExists = false;
        effects.forEach((eff) => {
          if (
            eff.eff == neweff.eff &&
            eff.targ == neweff.targ &&
            !UNCOMBINABLE_EFFECTS.includes(eff.eff)
          ) {
            effExists = true;
            eff.pow += neweff.pow;
          }
        });
        if (!effExists) {
          effects.push(neweff);
        }
      }
    });

  return (
    <InfoBox header="Combo Moves" className={styles.combo}>
      <select onChange={(event) => setType(Number(event.target.value))}>
        <option value={ComboType.Rivals}>Rivals Attack</option>
        <option value={ComboType.Partners}>Partners Volley</option>
        <option value={ComboType.Support}>Bestie/Sweetheart Support</option>
        <option value={ComboType.Defense}>Bestie/Sweetheart Defense</option>
      </select>
      <BeastieSelect beastieId={friendId} setBeastieId={setFriendId} />
      <MoveView
        move={{
          id: "whatever",
          targ: target,
          desc_tagids: [],
          description: null,
          bt_tags: [],
          use: use,
          desc_tags: [],
          name: `${beastiedata.name} + ${friend ? friend.name : "???"} ${ComboType[type]}`,
          type: moveType,
          pow:
            pows.length == 0
              ? 100
              : pows.length == 1
                ? Math.round((pows[0] * 100) / 5) * 5
                : Math.round(((pows[0] + pows[1]) * 50) / 5) * 5,
          eff: effects,
        }}
        noLearner={true}
      />
    </InfoBox>
  );
}
