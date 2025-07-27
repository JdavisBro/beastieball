import { BeastieType } from "../../data/BeastieData";
import { EncounterBeastie } from "../../data/EncounterData";
import MOVE_DIC from "../../data/MoveData";

export default function getMoveset(
  encBeastie: EncounterBeastie,
  beastieData: BeastieType,
  level: number,
) {
  const learned = [];
  for (const learn of beastieData.learnset) {
    if ((learn[0] as number) <= level) {
      learned.push(learn[1] as string);
    }
  }
  const moves = encBeastie.aggro
    ? []
    : learned.slice(Math.max(0, learned.length - 3)).reverse();

  if (!encBeastie.moves) {
    return moves;
  }

  for (let i = encBeastie.moves.length - 1; i >= 0; i--) {
    const slot = encBeastie.moves[i];
    let move: string;
    if (Array.isArray(slot)) {
      move = slot[0];
      for (let i = 0; i < slot.length; i++) {
        if (learned.includes(slot[i])) {
          move = slot[i];
          break;
        } else {
          if (!beastieData.attklist.includes(slot[i])) {
            continue;
          } else if (
            beastieData.learnset.find((learn) => learn[1] == slot[i])
          ) {
            move = slot[i];
          } else {
            move = slot[i];
            if (i == slot.length - 1) {
              break;
            }
            const next_move = slot[i + 1];
            if (learned.includes(next_move)) {
              const learns = beastieData.learnset.find(
                (learn) => learn[1] == next_move,
              );
              if (!learns?.length) {
                break;
              }
              const learn_level = learns[0] as number;
              if (level >= learn_level + 8) {
                break;
              }
              continue;
            } else if (level >= 12 * (slot.length - i - 1)) {
              break;
            }
          }
        }
      }
    } else {
      move = slot;
    }

    if (MOVE_DIC[move] && beastieData.attklist.includes(move)) {
      const index = moves.indexOf(move);
      if (index > -1) {
        moves.splice(index, 1);
      }
      moves.unshift(move);
    }
  }
  if (moves.length > 3 && !encBeastie.aggro) {
    moves.splice(3, moves.length - 3);
  }
  if (encBeastie.aggro) {
    moves.push("meter"); // Rowdy
  }

  return moves;
}
