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
  const [type, setType] = useState<ComboType>(ComboType.Rivals);

  const [friendId, setFriendId] = useState<string | undefined>(undefined);
  const friend = friendId ? BEASTIE_DATA.get(friendId) : undefined;

  const powMults: number[] = [1, 1];
  let target = 0;
  let use = 0;
  const moveType =
    type == ComboType.Partners
      ? 3
      : type == ComboType.Defense
        ? 5
        : type == ComboType.Support
          ? 4
          : // Rivals
            beastiedata.type_focus;

  const effects: MoveEffect[] = [];
  let fullrestore = false;
  (friend ? [beastiedata, friend] : [beastiedata])
    .sort((beastie, beastie2) => beastie.number - beastie2.number)
    .forEach((beastie, beastieIndex) => {
      for (let i = 0; i < beastie.combos[type].length; i += 3) {
        const neweff = {
          eff: beastie.combos[type][i],
          targ: beastie.combos[type][i + 1],
          pow: beastie.combos[type][i + 2],
        };
        if (neweff.eff == 47) {
          fullrestore = true;
        }
        switch (neweff.eff) {
          case 49:
            target = neweff.pow;
            continue;
          case 50:
            powMults[beastieIndex] = neweff.pow;
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

  if (fullrestore) {
    for (let i = 0; i < effects.length; i++) {
      if (effects[i].eff == 8 && effects[i].pow > 0) {
        effects.splice(i, 1);
        i--;
      }
    }
  }

  return (
    <InfoBox header="Combo Moves" className={styles.combo}>
      <select onChange={(event) => setType(Number(event.currentTarget.value))}>
        <option value={ComboType.Rivals}>Rivals Attack</option>
        <option value={ComboType.Partners}>Partners Volley</option>
        <option value={ComboType.Support}>Bestie/Sweetheart Support</option>
        <option value={ComboType.Defense}>Bestie Defense</option>
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
          pow: Math.round(((powMults[0] + powMults[1]) * 50) / 5) * 5,
          eff: effects,
        }}
        noLearner={true}
        typeText={
          type == ComboType.Rivals
            ? "Rivals Move type is the type with the highest POW on the user Beastie."
            : undefined
        }
      />
    </InfoBox>
  );
}
