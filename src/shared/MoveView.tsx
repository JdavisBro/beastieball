import TextTag from "./TextTag";
import styles from "./Shared.module.css";
import { TypeData } from "../data/TypeColor";
import { Type, Move, MoveEffect } from "../data/MoveData";
import MoveModalContext from "./MoveModalContext";
import { useContext, useMemo } from "react";
import SOCIAL_DATA from "../data/SocialData";
import { useIsSpoilerFriend } from "./useSpoiler";
import { useLocalStorage } from "usehooks-ts";
import useLocalization, {
  LocalizationFunction,
} from "../localization/useLocalization";

// reuqired: targ=12 says Targets SIDEWAYS.

const TARGET_STRINGS: Record<number, string> = {
  0: "movedefine_032", // self
  1: "movedefine_033", // ally
  2: "movedefine_034", // active team
  3: "movedefine_035", // target
  4: "movedefine_036", // target team
  5: "movedefine_037", // target's ally
  6: "movedefine_038", // entire team
  7: "movedefine_039", // every fielded player
  8: "movedefine_040", // other team
  9: "movedefine_041", // nearest enemy
};

const ALT_TARGET_STRINGS: Record<number, string> = {
  0: "movedefine_032",
  1: "movedefine_033",
  2: "movedefine_034",
  3: "movedefine_042", // benched ally
  6: "movedefine_038",
  7: "movedefine_045", // entire field
  8: "movedefine_040",
  9: "movedefine_041",
};

const FIELD_TARGET: Record<number, string> = {
  0: "movedefine_043", // ally field
  2: "movedefine_043",
  3: "movedefine_044", // opponent field
  5: "movedefine_044",
  7: "movedefine_045", // entire field
};

const FEELING_EFF_MAP: Record<number, [string, string, string]> = {
  6: ["[sprStatus,0]", "statuseffectstuff_001", "statuseffectstuff_014"],
  12: ["[sprStatus,1]", "statuseffectstuff_002", "statuseffectstuff_015"],
  13: ["[sprStatus,2]", "statuseffectstuff_003", "statuseffectstuff_016"],
  14: ["[sprStatus,3]", "statuseffectstuff_004", "statuseffectstuff_017"],
  19: ["[sprStatus,4]", "statuseffectstuff_005", "statuseffectstuff_018"],
  22: ["[sprStatus,5]", "statuseffectstuff_006", "statuseffectstuff_019"],
  23: ["[sprStatus,6]", "statuseffectstuff_007", "statuseffectstuff_020"],
  26: ["[sprStatus,8]", "statuseffectstuff_009", "statuseffectstuff_022"],
  27: ["[sprStatus,9]", "statuseffectstuff_010", "statuseffectstuff_023"],
  29: ["[sprStatus,10]", "statuseffectstuff_011", "statuseffectstuff_024"],
  38: ["[sprStatus,11]", "statuseffectstuff_012", "statuseffectstuff_025"],
  39: ["[sprStatus,12]", "statuseffectstuff_013", "statuseffectstuff_026"],
};

function getEffectString(
  effect: MoveEffect,
  attack: boolean,
  alt_target: boolean,
  args: { joiningEffects: null | boolean | Record<string, string> },
  move: Move,
  L: LocalizationFunction,
): string {
  let pow = Math.min(5, Math.abs(Math.floor(effect.pow)) - 1); // Max 6 boosts at once?
  let boost = "";
  while (pow >= 0) {
    boost +=
      effect.pow > 0
        ? `[sprBoost,${Math.min(2, pow)}]`
        : `[sprBoost,${Math.min(2, pow) + 3}]`;
    pow -= 3;
  }
  const targKey = (alt_target ? ALT_TARGET_STRINGS : TARGET_STRINGS)[
    effect.targ
  ];
  if (targKey == undefined) {
    console.log(`Target ${effect.targ} undefined!! ${effect}`);
  }
  const target = L(targKey);

  let target_field = FIELD_TARGET[effect.targ];
  if (target_field) {
    target_field = L(target_field);
    target_field = target_field[0].toUpperCase() + target_field.slice(1);
  }

  switch (effect.eff) {
    case 0:
    case 1:
    case 2:
      return L("movedefine_descadd_021", {
        "0": `[sprIcon,${effect.eff}]`,
        "1": boost,
        target: target,
      });
    case 3:
    case 4:
    case 5:
      return L("movedefine_descadd_024", {
        "0": `[sprIcon,${effect.eff - 3}]`,
        "1": boost,
        target: target,
      });
    case 6:
    case 12:
    case 13:
    case 14:
    case 19:
    case 22:
    case 23:
    case 26:
    case -26:
    case 27:
    case 29:
    case 38:
    case 39: {
      const [im, nameKey, descKey] = FEELING_EFF_MAP[Math.abs(effect.eff)];
      const feelingText = `${im}${L(nameKey)} ${L(descKey)}`;
      const feelTarget = target[0].toUpperCase() + target.slice(1);
      const placeholders = {
        "0": (effect.eff == 23 ? "+" : "") + String(Math.abs(effect.pow)),
        "1": feelingText,
        Target: feelTarget,
      };
      if (args.joiningEffects == true) {
        args.joiningEffects = placeholders;
        return "";
      } else if (args.joiningEffects) {
        const newPlaceholders = {
          "0": args.joiningEffects["0"],
          "1": args.joiningEffects["1"],
          "2": placeholders["0"],
          "3": placeholders["1"],
          Target: feelTarget,
        };
        args.joiningEffects = null;
        return L(
          effect.targ == 0 ? "movedefine_005" : "movedefine_006",
          newPlaceholders,
        );
      }
      const key =
        effect.eff == 23 && effect.pow > 0 && effect.targ == 7
          ? "movedefine_048" // Every non-FEELING fielded player feels
          : effect.eff < 0 && attack
            ? effect.targ == 0
              ? "movedefine_007" // Feel ... before contact
              : "movedefine_008" // Targ feels ... before contact
            : effect.targ == 0
              ? "movedefine_003" // Feels
              : "movedefine_004"; // Targ feels

      return L(key, placeholders);
    }
    case -7:
    case 7: {
      const key =
        attack && effect.eff > 0 ? "movedefine_019" : "movedefine_014";

      return L(key, {
        "0": L(
          [
            "movedefine_015",
            "movedefine_016",
            "movedefine_017",
            "3",
            "4",
            "5",
            "6",
            "movedefine_018",
          ][effect.pow],
        ),
        target: target,
      });
    }
    case 8: {
      const hp = String(Math.floor(Math.round(effect.pow * 10000000) / 100000)); // rounds to 5dp then floors because funny float imprecision
      if (effect.pow < 0) {
        if (effect.targ == 0) {
          return L("movedefine_descadd_034", { "0": hp });
        } else {
          return L("movedefine_descadd_035", { "0": hp, target: target });
        }
      } else {
        return L("movedefine_descadd_033", { "0": "+" + hp, target: target });
      }
    }
    case 10:
      return L("movedefine_descadd_036", { "0": `+${effect.pow}` });
    case 11:
      return L("movedefine_descadd_037");
    case 15:
      return L("movedefine_descadd_021", {
        "0": "[sprIcon,0][sprIcon,1][sprIcon,2]",
        "1": boost,
        target: target,
      });
    case 16:
      return L("movedefine_descadd_024", {
        "0": "[sprIcon,0][sprIcon,1][sprIcon,2]",
        "1": boost,
        target: target,
      });
    case 17:
      return L("movedefine_descadd_042");
    case 18:
      if (effect.targ == 3) {
        return L("movedefine_descadd_043");
      }
      return L("movedefine_descadd_004");
    case 20:
      if (effect.targ == 1) {
        return L("movedefine_descadd_045");
      } else {
        return L("movedefine_descadd_044", { target: target });
      }
    case 28:
      return L("movedefine_descadd_041");
    case -30:
      return move.eff.length < 3
        ? L("movedefine_descadd_038")
        : L("movedefine_descadd_039");
    case 30:
      if (alt_target) {
        return move.eff.length < 3
          ? L("movedefine_descadd_038")
          : L("movedefine_descadd_039");
      } else {
        return L("movedefine_descadd_040", { target: target });
      }
    case 31:
      return L("movedefine_descadd_052", {
        "0": "[sprBoost,2]",
        "1": "[sprBoost,5]",
        target: target,
      });
    case 32:
      return L("movedefine_descadd_053", {
        "0": "[sprStatus,1]" + L("statuseffectstuff_002"),
        target: target,
      });
    case 33: {
      switch (effect.pow) {
        case 0:
          return L("movedefine_descadd_058");
        case 1:
          return L("movedefine_descadd_059");

        case 5:
          return L("movedefine_descadd_060");
        case 6:
          return L("movedefine_descadd_061");
        case 7:
          return L("movedefine_descadd_062");
        case 8:
          return L("movedefine_descadd_063");
        case 9:
          return L("movedefine_descadd_064");
        case 10:
          return L("movedefine_descadd_065");
        case 11:
          return L("movedefine_descadd_066");
        case 12:
          return L("movedefine_descadd_067", {
            "0": "[sprStatus,6]" + L("statuseffectstuff_007"),
            "1": "[sprStatus,0]" + L("statuseffectstuff_001"),
            "2": "[sprStatus,11]" + L("statuseffectstuff_012"),
          });
        case 13:
          return L("movedefine_descadd_068", { "0": "2" });
        case 14:
          return L("movedefine_descadd_069");
        case 15:
          return L("movedefine_descadd_070");
        case 16:
          return L("movedefine_descadd_071");
        case 17:
          return L("movedefine_descadd_072", {
            "0": "[sprStatus,9]" + L("statuseffectstuff_010"),
          });
        case 18:
          return L("movedefine_descadd_073");
        case 19:
          return L("movedefine_descadd_074");
        case 20:
          return L("movedefine_descadd_076");
        case 21:
          return L("movedefine_descadd_077");
        case 22:
          return L("movedefine_descadd_079");
        case 23:
          return L("movedefine_descadd_080");
        case 25:
          return L("movedefine_descadd_081", {
            "0": L("fieldeffectstuff_001"),
          }); // Boosted by RALLY instead of weakened.
        case 26:
          return L("movedefine_descadd_075");
        case 27:
          return L("movedefine_descadd_092", {
            "0": "2",
            "1": "34",
          });

        case 29:
          return L("movedefine_descadd_094");
        case 30:
          return L("movedefine_descadd_095");
      }
      console.log(
        `Undefined POW COND ${effect.pow}. E ${effect.eff} T ${effect.targ}`,
      );
      return `POW COND ${effect.pow}`;
    }
    case 34:
      return L("movedefine_descadd_055", { target: target });
    case 36:
      if (effect.targ == 5 && effect.pow == 1) {
        return L("movedefine_descadd_048");
      }
      return L("movedefine_descadd_049", {
        "0": String(effect.pow * 100),
        target: target,
      });
    case 40:
      return L("movedefine_descadd_056");
    case 41:
      return L("movedefine_descadd_057");
    case 42:
    case 43:
      return L("movedefine_descadd_083", {
        Field: target_field,
        "0": `+${effect.pow}`,
        "1": L("fieldeffectstuff_006", {
          "0": L(
            effect.eff == 42 ? "fieldeffectstuff_002" : "fieldeffectstuff_001",
          ),
          "1":
            effect.eff == 42
              ? L("fieldeffectstuff_008", { "1": "8" })
              : L("fieldeffectstuff_007", { "1": "+50", "2": "¾" }),
        }),
      });
    case 44:
    case 45:
      return L("movedefine_descadd_097", {
        Field: target_field,
        "1": L("fieldeffectstuff_006", {
          "0": L(
            effect.eff == 44 ? "fieldeffectstuff_003" : "fieldeffectstuff_004",
          ),
          "1": L(
            effect.eff == 44 ? "fieldeffectstuff_009" : "fieldeffectstuff_010",
          ),
        }),
      });
    case 46:
      if (effect.targ == 7) {
        return L("movedefine_descadd_082"); // Clears all FIELD EFFECTS.
      }
      break;
    case 47:
      if (effect.targ == 0) {
        return L("movedefine_descadd_031");
      }
      return L("movedefine_descadd_032", { target: target });
    case 52:
      return L("movedefine_descadd_054", {
        target: target,
        "0": "[sprStatus,1]" + L("statuseffectstuff_002"),
      });
    case 53:
      args.joiningEffects = true;
      return "";
    case 56:
      return L("movedefine_descadd_084", { target: target });
    case 57:
      return ""; // shows on a few that are only used on back row but not others?
    case 60:
      return ""; // rowdy, displays as nothing, probably gives an extra rowdy point
    case 61:
      return L("movedefine_descadd_030", {
        "0": "[sprStatus,2]" + L("statuseffectstuff_003"),
        "1": "[sprStatus,10]" + L("statuseffectstuff_011"),
        "2": "[sprStatus,5]" + L("statuseffectstuff_006"),
      });
    case 63:
      return L("movedefine_descadd_085", {
        target: L(TARGET_STRINGS[effect.targ]),
      });
    case 64:
      return L("movedefine_descadd_029", {
        field: target_field.toLowerCase(),
        "0": L(`fieldeffectstuff_${String(effect.pow + 1).padStart(3, "0")}`),
      });
    case 69:
      return ""; // Only when hittable - i do this elsewhere since it needs to be first.
    case 70: {
      const firstQuake =
        move.eff.find((ieff) => ieff.eff == effect.eff) == effect;
      return L("movedefine_descadd_083", {
        "0": String(effect.pow),
        "1": firstQuake
          ? L("fieldeffectstuff_006", {
              "0": L("fieldeffectstuff_005"),
              "1": L("fieldeffectstuff_011", { "1": "25" }),
            })
          : L("fieldeffectstuff_005"),
        Field: target_field,
      });
    }
    case 71:
      return L("movedefine_descadd_046");
    case 72:
      return L("movedefine_descadd_091");
    case 73:
      return L("movedefine_descadd_096");

    case 74:
    case 75:
    case 76:
      return L("movedefine_descadd_089", {
        "0": `[sprIcon,${effect.eff == 76 ? "1" : "0"}]`,
        "2": `[sprIcon,${effect.eff == 74 ? "1" : "2"}]`,
        "1": boost,
        target: target,
      });
    case 77:
    case 78:
    case 79:
      return L("movedefine_descadd_090", {
        "0": `[sprIcon,${effect.eff == 79 ? "1" : "0"}]`,
        "2": `[sprIcon,${effect.eff == 77 ? "1" : "2"}]`,
        "1": boost,
        target: target,
      });
    case 81:
      return L("movedefine_descadd_098", { target: target });
    case 82:
      if (effect.targ != 0) {
        return L("movedefine_descadd_099", {
          target: target,
          "0": String(effect.pow),
        });
      } else {
        return L("movedefine_050", { "0": String(effect.pow) });
      }
  }
  console.log(
    `Undefined Move Effect: E ${effect.eff} T ${effect.targ} P ${effect.pow}`,
  );
  return `E ${effect.eff} T ${effect.targ} P ${effect.pow}`;
}

export function getMoveDesc(move: Move, L: LocalizationFunction) {
  const desc = [];

  const attack = move.type < 3;

  switch (move.use) {
    case 1:
      desc.push(L("movedefine_descadd_007"));
      break;
    case 2:
      // If it auto targets front row and is Only used from net then ONLY is not included.
      if (move.targ == 4 && attack) {
        desc.push(L("movedefine_descadd_006"));
      } else {
        desc.push(L("movedefine_descadd_008"));
      }
      break;
  }

  if (move.eff.find((effect) => effect.eff == 69)) {
    desc.push(L("movedefine_descadd_009"));
  } else if (
    move.type == Type.Volley &&
    !move.eff.some((eff) => eff.eff == 20) // Eff 20: Ball goes to TARGET. Does not have volley text
  ) {
    desc.push(L("movedefine_descadd_019"));
  }

  if (attack) {
    switch (move.targ) {
      case 1:
      case 3:
        desc.push(L("movedefine_descadd_015"));
        break;
      case 4:
        if (move.use == 2) {
          break;
        }
        desc.push(L("movedefine_descadd_012"));
        break;
      case 8:
        desc.push(L("movedefine_descadd_013"));
        break;
      case 12:
        desc.push(L("movedefine_descadd_014"));
        break;
      case 13:
        desc.push(L("movedefine_descadd_010"));
        break;
    }

    if (move.pow < -1) {
      desc.push(L("movedefine_descadd_018", { "0": String(-move.pow) }));
    } else if (move.pow > -1 && move.pow < 0) {
      desc.push(L("movedefine_descadd_017", { "0": String(-move.pow * 100) }));
    }

    if (!desc.length && move.eff.length < 2) {
      if (move.eff.length == 0) {
        desc.push(L("movedefine_descadd_088", { "0": String(move.type) }));
      } else {
        desc.push(L("movedefine_descadd_001"));
      }
    }
  }

  const args = { joiningEffects: null };

  const desc_str = desc
    .concat(
      move.eff
        .map((effect) =>
          getEffectString(
            effect,
            attack,
            !attack && (move.targ == 0 || move.targ == 8),
            args,
            move,
            L,
          ),
        )
        .filter((effect) => !!effect),
    )
    .join(" ");
  return desc_str;
}

export default function MoveView(props: {
  move: Move;
  noLearner?: boolean;
  friendFilter?: string;
  typeText?: string;
}): React.ReactElement | null {
  const { L } = useLocalization();

  const setMoveModal = useContext(MoveModalContext);

  let friend = SOCIAL_DATA.find((friend) =>
    friend.plays.includes(props.move.id),
  );

  const [simpleMoves] = useLocalStorage("simpleMoves", false);

  const [isSpoilerFriend, setSeenFriend] = useIsSpoilerFriend();
  const friendSpoiler = friend ? isSpoilerFriend(friend.id) : false;
  let friend_hearts = 0;
  let learned_text;
  if (friend) {
    const friend_rank = Math.floor(friend.plays.indexOf(props.move.id) / 4) + 1;
    let rank = 0;
    const found = friend.events.find((event) => {
      friend_hearts += 1;
      if (event.rankup) {
        rank += 1;
      }
      return rank == friend_rank;
    });
    if (!found) {
      friend = undefined;
    } else {
      learned_text = L("common.moveView.learnedFriend", {
        friend: friendSpoiler
          ? L(friend.name).slice(0, 2) + "..."
          : L(friend.name),
        hearts: String(friend_hearts),
      });
    }
  }

  var desc_str = useMemo(() => getMoveDesc(props.move, L), [props.move.id, L]);

  if (props.friendFilter && (!friend || friend.id != props.friendFilter)) {
    return null;
  }

  const {
    color,
    darkColor,
    alt: altKey,
  } = TypeData[props.move.type]
    ? TypeData[props.move.type]
    : { color: "#ffffff", alt: "a" };

  const alt = L("common.moveView.playText", {
    type: L("common.types." + altKey),
  });

  const style = {
    "--move-color": color,
    "--move-dark": darkColor,
    "--move-url": `url("/gameassets/sprType/${String(props.move.type)}.png")`,
  } as React.CSSProperties;

  const pow =
    props.move.type < 3 ? (
      <div className={styles.movepower}>
        {String(Math.max(0, props.move.pow))}
      </div>
    ) : null;

  const moveName =
    props.move.name[0] == "¦" ? L(props.move.name) : props.move.name;

  return (
    <div className={styles.movecontainer} style={style}>
      <div className={styles.moveviewbar}>
        <div
          className={styles.moveviewimage}
          title={props.typeText ? props.typeText : alt}
        ></div>
        {pow}
      </div>
      <div className={styles.moveseparator}></div>
      <div className={styles.movecontent}>
        {simpleMoves ? null : (
          <div className={styles.moveothercolor}>
            <div className={styles.movehalftone}></div>
          </div>
        )}
        <div
          className={
            moveName.length > 18 ? styles.movenamelong : styles.movename
          }
        >
          {moveName}{" "}
          {friend ? (
            <span
              title={learned_text}
              className={styles.movefriend}
              style={{
                backgroundImage: `url(${
                  friendSpoiler
                    ? "/gameassets/sprExclam_1.png"
                    : `/gameassets/sprChar_icon/${friend.img}.png`
                })`,
              }}
              onClick={
                friendSpoiler
                  ? () => {
                      setSeenFriend(friend.id);
                    }
                  : undefined
              }
            >
              <span>{friend_hearts}</span>
            </span>
          ) : null}
          {props.noLearner ? null : (
            <img
              src="/gameassets/sprMainmenu/6.png"
              className={styles.movelearnerbutton}
              tabIndex={0}
              onClick={() => {
                if (setMoveModal) {
                  setMoveModal(props.move);
                }
              }}
              onKeyDown={(event) => {
                if (event.key == "Enter" && setMoveModal) {
                  setMoveModal(props.move);
                }
              }}
              role="button"
              alt={L("common.moveView.viewLearners")}
              title={L("common.moveView.viewLearners")}
            />
          )}
        </div>
        <div className={styles.movedesc}>
          <TextTag>{desc_str}</TextTag>
        </div>
      </div>
    </div>
  );
}
