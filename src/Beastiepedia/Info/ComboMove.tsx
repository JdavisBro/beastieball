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

export default function ComboMove({
  beastiedata,
}: {
  beastiedata: BeastieType;
}) {
  const [type, setType] = useState<ComboType>(ComboType.Rivals);

  const [friendId, setFriendId] = useState<string | undefined>(undefined);
  const friend = friendId ? BEASTIE_DATA.get(friendId) : undefined;

  const powMults: number[] = [1, 1];
  let target = type == ComboType.Rivals ? 0 : type == ComboType.Defense ? 1 : 2;
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
  const used_effects: Record<number, MoveEffect> = {};
  (friend ? [beastiedata, friend] : [beastiedata])
    .sort((beastie, beastie2) => beastie.number - beastie2.number)
    .forEach((beastie, beastieIndex) => {
      for (let i = 0; i < beastie.combos[type].length; i += 3) {
        const neweff = {
          eff: beastie.combos[type][i],
          targ: beastie.combos[type][i + 1],
          pow: beastie.combos[type][i + 2],
        };
        switch (neweff.eff) {
          case 49:
            target =
              [15, 12, 4, 13, 2, 8, 1, 0].find(
                (newtarget) => newtarget == target || newtarget == neweff.pow,
              ) ?? target;
            continue;
          case 50:
            powMults[beastieIndex] = neweff.pow;
            continue;
          case 51:
            use =
              [2, 1, 0].find(
                (newuse) => newuse == use || newuse == neweff.pow,
              ) ?? use;
            continue;
        }
        if (
          used_effects[47] &&
          [8, 52, 32].includes(neweff.eff) &&
          neweff.pow >= 0
        ) {
          const fr_effect = used_effects[47];
          if (
            fr_effect.targ == neweff.targ ||
            (fr_effect.targ == 2 && (neweff.targ == 0 || neweff.targ == 1))
          ) {
            continue;
          }
        }

        let do_add = false;
        if (neweff.eff == 33) {
          const powMods = effects.filter((eff) => eff.eff == 33);
          const newType = neweff.pow;
          do_add = true;
          mod_loop: for (const oldMod of powMods) {
            const oldType = oldMod.pow;
            switch (newType) {
              case 0:
              case 1: {
                if (oldType == 0 || oldType == 1) {
                  oldMod.pow = 0;
                  do_add = false;
                  break mod_loop;
                }
                break;
              }
              case 22:
              case 23: {
                if (oldType == 22 || oldType == 23) {
                  oldMod.pow = 22;
                  do_add = false;
                  break mod_loop;
                }
                break;
              }
              case 2:
              case 3:
              case 4: {
                if (oldType == 2 || oldType == 3 || oldType == 4) {
                  do_add = false;
                  break mod_loop;
                }
                break;
              }
            }
          }
        }

        if (
          used_effects[neweff.eff] &&
          [
            0, 1, 2, 3, 4, 5, 15, 16, 8, 10, 42, 43, 70, 26, 27, 23, 29, 14, 19,
            38, 22, 12, 6, 13, 36,
          ].includes(neweff.eff)
        ) {
          const oldeff = used_effects[neweff.eff];

          if (oldeff.targ < 3 == neweff.targ < 3) {
            if (oldeff.targ == neweff.targ) {
              oldeff.pow += neweff.pow;
              if (oldeff.pow == 0) {
                effects.splice(
                  effects.findIndex((value) => value == oldeff),
                  1,
                );
              }
            } else if (
              (oldeff.targ == 2 && neweff.targ < 3) ||
              (oldeff.targ < 3 && neweff.targ == 2) ||
              (((oldeff.targ == 0 && neweff.targ == 1) ||
                (oldeff.targ == 1 && neweff.targ == 0)) &&
                Math.sign(oldeff.pow) == Math.sign(neweff.pow))
            ) {
              oldeff.targ = 2;
              let newpow = oldeff.pow + (neweff.pow - oldeff.pow) * 0.5;
              if (neweff.eff == 8) {
                newpow = Math.round(newpow * 20) / 20;
              } else {
                newpow = Math.round(newpow);
              }
              oldeff.pow = newpow;
              if (newpow == 0) {
                effects.splice(
                  effects.findIndex((value) => value == oldeff),
                  1,
                );
              }
            } else if (
              oldeff.eff <= 3 &&
              neweff.eff <= 3 &&
              oldeff.targ != 6 &&
              neweff.targ != 6
            ) {
              oldeff.targ =
                [7, 8, 4, 3, 9].find(
                  (value) => value == oldeff.targ || value == neweff.targ,
                ) ?? oldeff.targ;
              oldeff.pow = neweff.pow;
            } else if (Math.abs(oldeff.pow) > Math.abs(neweff.pow)) {
              do_add = true;
              effects.splice(
                effects.findIndex((value) => value == oldeff),
                1,
              );
            }
          }
        }

        if (do_add || !used_effects[neweff.eff]) {
          neweff.pow =
            neweff.eff == 8
              ? Math.round(neweff.pow * 20) / 20
              : Math.round(neweff.pow);

          effects.push(neweff);
          used_effects[neweff.eff] = neweff;

          if (neweff.eff == 47) {
            for (let i = 0; i < effects.length; i++) {
              switch (effects[i].eff) {
                case 52:
                case 32:
                  effects.splice(i, 1);
                  i--;
                  break;
                case 8: {
                  const eff = effects[i];
                  if (eff.targ == neweff.targ && eff.pow > 0) {
                    effects.splice(i, 1);
                    i--;
                  }
                  break;
                }
              }
            }
          }
        }
      }
    });

  return (
    <InfoBox header="Combo Moves" container={{ className: styles.combo }}>
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
