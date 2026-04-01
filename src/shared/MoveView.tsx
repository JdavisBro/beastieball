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
import abilities from "../data/abilities";

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
  10: "movedefine_051", // front row active team
  11: "movedefine_034", // active team
  12: "movedefine_052", // target and self
};

const ALT_TARGET_STRINGS: Record<number, string> = {
  0: "movedefine_032", // self
  1: "movedefine_033", // ally
  2: "movedefine_034", // active team
  3: "movedefine_042", // benched ally
  6: "movedefine_038", // entire team
  7: "movedefine_045", // entire field
  8: "movedefine_040", // other team
  9: "movedefine_041", // nearest enemy
  11: "movedefine_034", // active team
};

const FIELD_TARGET: Record<number, string> = {
  0: "movedefine_043", // ally field
  2: "movedefine_043", // ally field
  3: "movedefine_044", // opponent field
  5: "movedefine_044", // opponent field
  7: "movedefine_045", // entire field
};

const FEELING_EFF_MAP: Record<number, [string, string, string]> = {
  6: ["[sprStatus,0]", "statuseffectstuff_001", "statuseffectstuff_014"], // NERVOUS -- (can't move)
  12: ["[sprStatus,1]", "statuseffectstuff_002", "statuseffectstuff_015"], // ANGRY -- (only attacks)
  13: ["[sprStatus,2]", "statuseffectstuff_003", "statuseffectstuff_016"], // SHOOK -- (can't attack)
  14: ["[sprStatus,3]", "statuseffectstuff_004", "statuseffectstuff_017"], // NOISY -- (attracts attacks)
  19: ["[sprStatus,4]", "statuseffectstuff_005", "statuseffectstuff_018"], // TOUGH -- (¼ damage)
  22: ["[sprStatus,5]", "statuseffectstuff_006", "statuseffectstuff_019"], // WIPED -- (must bench)
  23: ["[sprStatus,6]", "statuseffectstuff_007", "statuseffectstuff_020"], // SWEATY -- (losing stamina)
  26: ["[sprStatus,8]", "statuseffectstuff_009", "statuseffectstuff_022"], // JAZZED -- (POW +50%)
  27: ["[sprStatus,9]", "statuseffectstuff_010", "statuseffectstuff_023"], // BLOCKED -- (POW x2/3)
  29: ["[sprStatus,10]", "statuseffectstuff_011", "statuseffectstuff_024"], // TIRED -- (only basic actions)
  38: ["[sprStatus,11]", "statuseffectstuff_012", "statuseffectstuff_025"], // TENDER -- (DEF x½)
  39: ["[sprStatus,12]", "statuseffectstuff_013", "statuseffectstuff_026"], // STRESSED -- (becomes [sprStatus,10]TIRED)
  80: ["[sprStatus,18]", "statuseffectstuff_029", "statuseffectstuff_030"], // WEEPY -- (ignores BOOSTs)
};

function getEffectString(
  effect: MoveEffect,
  attack: boolean,
  alt_target: boolean,
  args: { joiningEffects: null | boolean | Record<string, string> },
  move: Move,
  L: LocalizationFunction,
): string {
  const num_pow = typeof effect.pow == "number" ? effect.pow : 0;
  let pow = Math.min(5, Math.abs(Math.floor(num_pow)) - 1); // Max 6 boosts at once?
  let boost = "";
  while (pow >= 0) {
    boost +=
      num_pow > 0
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

  let target_field = FIELD_TARGET[effect.targ]
    ? L(FIELD_TARGET[effect.targ])
    : "";

  const target_placeholders = {
    target: target,
    Target: target[0].toUpperCase() + target.slice(1),
    field: target_field ?? "",
    Field: target_field
      ? target_field[0].toUpperCase() + target_field.slice(1)
      : "",
  };

  switch (effect.eff) {
    case 0:
    case 1:
    case 2:
      return L("movedefine_descadd_021", { // {0}POW{1} to {target}.
        "0": `[sprIcon,${effect.eff}]`,
        "1": boost,
        ...target_placeholders,
      });
    case 3:
    case 4:
    case 5:
      return L("movedefine_descadd_024", { // {0}DEF{1} to {target}.
        "0": `[sprIcon,${effect.eff - 3}]`,
        "1": boost,
        ...target_placeholders,
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
    case 39:
    case 80: {
      const [im, nameKey, descKey] = FEELING_EFF_MAP[Math.abs(effect.eff)];
      const no_desc =
        (effect.eff == 23 && effect.pow > 0) ||
        (move.eff.filter((eff) => eff.eff != 53 && eff.eff != 87).length >= 3 &&
          move.id != "protectcheer"); // probably not correct, but matches the game now
      const feelingText = no_desc
        ? `${im}${L(nameKey)}`
        : `${im}${L(nameKey)} ${L(descKey)}`;
      const placeholders = {
        "0": (effect.pow < 0 ? "+" : "") + String(Math.abs(effect.pow)),
        "1": feelingText,
        ...target_placeholders,
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
          ...target_placeholders,
        };
        args.joiningEffects = null;
        return L(
          effect.targ == 0 ? "movedefine_005" : "movedefine_006", // Feel {0}{1} & {2}{3}. -- {Target} feels {0}{1} & {2}{3}.
          newPlaceholders,
        );
      }
      const key =
        effect.eff == 23 && effect.pow > 0
          ? effect.targ == 7
            ? "movedefine_048" // Every non-{1} fielded player feels {0} {1}.
            : "movedefine_049" // Non-{1} {target} feels {0} {1}.
          : effect.eff < 0 && attack
            ? effect.targ == 0
              ? "movedefine_007" // Feel {0} {1} before contact.
              : "movedefine_008" // {Target} feels {0} {1} before contact.
            : effect.targ == 0
              ? "movedefine_003" // Feel {0} {1}.
              : "movedefine_004"; // {Target} feels {0} {1}.

      return L(key, placeholders);
    }
    case -7:
    case 7: {
      const key =
        attack && effect.eff > 0
          ? "movedefine_019" // SHIFTs {target} to {0} after hitting.
          : attack && effect.targ > 0 && effect.pow == 1
            ? "movedefine_009" // Before contact, SHIFTs {target} to {0}.
            : "movedefine_014"; // SHIFTs {target} to {0}.

      return L(key, {
        "0": L(
          [
            "movedefine_015", // back row
            "movedefine_016", // front row
            "movedefine_017", // opposite lane
            "3",
            "4",
            "5",
            "6",
            "movedefine_018", // opposite row
          ][effect.pow],
        ),
        ...target_placeholders,
      });
    }
    case 8: {
      const hp = String(Math.floor(Math.round(effect.pow * 10000000) / 100000)); // rounds to 5dp then floors because funny float imprecision
      if (effect.pow < 0) {
        if (effect.targ == 0) {
          return L("movedefine_descadd_034", { "0": hp }); // {0} STAMINA.
        } else {
          return L("movedefine_descadd_035", { // {0} STAMINA to {target}.
            "0": hp,
            ...target_placeholders,
          });
        }
      } else {
        return L("movedefine_descadd_033", { // HEALs {target} {0}.
          "0": "+" + hp,
          ...target_placeholders,
        });
      }
    }
    case 10:
      return L("movedefine_descadd_036", { "0": `+${effect.pow}` }); // {0} ACTIONs.
    case 11:
      return L("movedefine_descadd_037"); // SWITCH places with fielded ally.
    case 15:
      return L("movedefine_descadd_021", { // {0}POW{1} to {target}.
        "0": "[sprIcon,0][sprIcon,1][sprIcon,2]",
        "1": boost,
        ...target_placeholders,
      });
    case 16:
      return L("movedefine_descadd_024", { // {0}DEF{1} to {target}.
        "0": "[sprIcon,0][sprIcon,1][sprIcon,2]",
        "1": boost,
        ...target_placeholders,
      });
    case 17:
      return L("movedefine_descadd_042"); // Can hit without volleying.
    case 18:
      return L("movedefine_descadd_043"); // Easy receive.
    case 20:
      if (effect.targ == 1) {
        return L("movedefine_descadd_045"); // Ally's ball becomes hittable.
      } else {
        return L("movedefine_descadd_044", { ...target_placeholders }); // Ball goes to {target}.
      }
    case 28:
      return L("movedefine_descadd_041"); // SWITCH places with ally without moving ball.
    case -30:
      return move.eff.length < 3
        ? L("movedefine_descadd_038") // TAG OUT with benched ally.
        : L("movedefine_descadd_039"); // TAG OUT.
    case 30:
      if (alt_target) {
        return move.eff.length < 3
          ? L("movedefine_descadd_038") // TAG OUT with benched ally.
          : L("movedefine_descadd_039"); // TAG OUT.
      } else {
        return L("movedefine_descadd_040", { ...target_placeholders }); // Force {target} to TAG OUT.
      }
    case 31:
      return L("movedefine_descadd_052", { // Transfer {0}{1}BOOSTS to {target}.
        "0": "[sprBoost,2]",
        "1": "[sprBoost,5]",
        ...target_placeholders,
      });
    case 32:
      return L("movedefine_descadd_053", { // Clears FEELINGs (except {0}) from {target}.
        "0": "[sprStatus,1]" + L("statuseffectstuff_002"), // ANGRY
        ...target_placeholders,
      });
    case 33: {
      switch (effect.pow) {
        case 0:
          return L("movedefine_descadd_058"); // Add user's STAMINA to POW.
        case 1:
          return L("movedefine_descadd_059"); // Strongest when user has less STAMINA.

        case 5:
          return L("movedefine_descadd_060"); // POW x2 if target just TAGGED IN.
        case 6:
          return L("movedefine_descadd_061"); // POW x2 if target just MOVED.
        case 7:
          return L("movedefine_descadd_062"); // POW x1.5 if used to serve.
        case 8:
          return L("movedefine_descadd_063"); // Strongest when target has more STAMINA.
        case 9:
          return L("movedefine_descadd_064"); // POW x2 if target STAMINA is 50 or less.
        case 10:
          return L("movedefine_descadd_065"); // POW +10 for each [sprBoost,0]BOOST on the user.
        case 11:
          return L("movedefine_descadd_066"); // POW +100% for each [sprBoost,0]BOOST on target.
        case 12:
          return L("movedefine_descadd_067", { // POW x2 when {0}, {1}, {2} or {3}.
            "0": "[sprStatus,6]" + L("statuseffectstuff_007"), // SWEATY
            "1": "[sprStatus,0]" + L("statuseffectstuff_001"), // NERVOUS
            "2": "[sprStatus,11]" + L("statuseffectstuff_012"), // TENDER
            "3": "[sprStatus,18]" + L("statuseffectstuff_029"), // WEEPY
          });
        case 13:
          return L("movedefine_descadd_068", { "0": "2" }); // POW x{0} if target has a bad FEELING.
        case 14:
          return L("movedefine_descadd_069"); // Ignores target's shields and [sprBoost,0]BOOSTS.
        case 15:
          return L("movedefine_descadd_070"); // POW x1.5 if tied or behind on score.
        case 16:
          return L("movedefine_descadd_071"); // Does more damage to back-row targets.
        case 17:
          return L("movedefine_descadd_072", { // Ignores {0}.
            "0": "[sprStatus,9]" + L("statuseffectstuff_010"), // BLOCKED
          });
        case 18:
          return L("movedefine_descadd_073"); // POW x1.5 if user received the ball.
        case 19:
          return L("movedefine_descadd_074"); // POW +50% for each volley between allies.
        case 20:
          return L("movedefine_descadd_076"); // POW x2 if the user recently TAGGED IN.
        case 21:
          return L("movedefine_descadd_077"); // POW +25% for each [sprBoost,3]BOOST on target.
        case 22:
          return L("movedefine_descadd_079"); // Damages based on target's weakest DEF.
        case 23:
          return L("movedefine_descadd_080"); // Damages based on target's strongest DEF.
        case 25:
          return L("movedefine_descadd_081", { // Boosted by {0} instead of weakened.
            "0": L("fieldeffectstuff_001"), // RALLY
          }); // Boosted by RALLY instead of weakened.
        case 26:
          return L("movedefine_descadd_075"); // POW x1.5 if user changed row or lane this turn.
        case 27:
          return L("movedefine_descadd_092", { // POW x{0} when STAMINA is below {1}.
            "0": "2",
            "1": "34",
          });

        case 29:
          return L("movedefine_descadd_094", { "0": "2" }); // POW x{0} if there are any field effects.
        case 30:
          return L("movedefine_descadd_095"); // POW x1.5 if user has 2+ ACTIONs.
        case 31:
          return L("movedefine_descadd_100", { // POW x{1} if user feels {0}.
            "0": "[sprStatus,8]" + L("statuseffectstuff_009"), // JAZZED
            "1": "1.5",
          });
        case 32:
          return L("movedefine_descadd_104", { "0": "¾" }); // POW x{0} if user has any FEELINGs.
        case 33:
          return "";
      }
      console.log(
        `Undefined POW COND ${effect.pow}. E ${effect.eff} T ${effect.targ}`,
      );
      return `POW COND ${effect.pow}`;
    }
    case 34:
      return L("movedefine_descadd_055", { ...target_placeholders }); // Clears [sprBoost,0][sprBoost,3]BOOSTs from {target}.
    case 36:
      if (effect.targ == 5 && effect.pow == 1) {
        return L("movedefine_descadd_048"); // Damages both opponents.
      }
      return L("movedefine_descadd_049", { // Additional {0}% damage to {target}.
        "0": String(effect.pow * 100),
        ...target_placeholders,
      });
    case 40:
      return L("movedefine_descadd_056"); // Requires 2 ACTIONS.
    case 41:
      return L("movedefine_descadd_057"); // Requires 3 ACTIONS.
    case 42:
    case 43:
      return L("movedefine_descadd_083", { // {Field} gets {0} {1}.
        ...target_placeholders,
        "0": `+${effect.pow}`,
        "1": L("fieldeffectstuff_006", { // {0} ({1})
          "0": L(
            effect.eff == 42 ? "fieldeffectstuff_002" : "fieldeffectstuff_001", // TRAP -- RALLY
          ),
          "1":
            effect.eff == 42
              ? L("fieldeffectstuff_008", { "1": "8" }) // Tag-ins lose {1} stamina per trap
              : L("fieldeffectstuff_007", { "3": "20", "2": "¾" }), // [sprIcon,1] damage +{3}, [sprIcon,2] damage x{2}
        }),
      });
    case 44:
    case 45:
      return L("movedefine_descadd_097", { // {Field} fills with {1}.
        ...target_placeholders,
        "1": L("fieldeffectstuff_006", { // {0} ({1})
          "0": L(
            effect.eff == 44 ? "fieldeffectstuff_003" : "fieldeffectstuff_004", // RHYTHM -- DREAD
          ),
          "1": L(
            effect.eff == 44 ? "fieldeffectstuff_009" : "fieldeffectstuff_010", // Healing and protection -- No good feelings
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
        return L("movedefine_descadd_031"); // Fully restores stamina and FEELINGS.
      }
      return L("movedefine_descadd_032", { ...target_placeholders }); // Restores {target}'s stamina and FEELINGS.
    case 52:
      return L("movedefine_descadd_054", { // Clears negative FEELINGs (except {0}) from {target}.
        ...target_placeholders,
        "0": "[sprStatus,1]" + L("statuseffectstuff_002"), // ANGRY
      });
    case 53:
      args.joiningEffects = true;
      return "";
    case 56:
      return L("movedefine_descadd_084", { ...target_placeholders }); // Build a BARRIER in front of {target}.
    case 57:
      return ""; // shows on a few that are only used on back row but not others?
    case 60:
      return ""; // rowdy, displays as nothing, probably gives an extra rowdy point
    case 61:
      return L("movedefine_descadd_030", { // Can use even when {0}, {1} or {2}.
        "0": "[sprStatus,2]" + L("statuseffectstuff_003"), // SHOOK
        "1": "[sprStatus,10]" + L("statuseffectstuff_011"), // TIRED
        "2": "[sprStatus,5]" + L("statuseffectstuff_006"), // WIPED
      });
    case 63: {
      const targ = L(TARGET_STRINGS[effect.targ]);
      return L("movedefine_descadd_085", { // Swaps Trait with {target}.
        target: targ,
        Target: targ[0].toUpperCase() + targ.slice(1),
      });
    }
    case 64:
      return L("movedefine_descadd_029", { // If {field} has {0}: 
        ...target_placeholders,
        "0": L(`fieldeffectstuff_${String(effect.pow + 1).padStart(3, "0")}`),
      });
    case 69:
      return ""; // Only when hittable - i do this elsewhere since it needs to be first.
    case 70: {
      return L("movedefine_descadd_083", { // {Field} gets {0} {1}.
        ...target_placeholders,
        "0": String(effect.pow),
        "1": L("fieldeffectstuff_006", { // {0} ({1})
          "0": L("fieldeffectstuff_005"), // QUAKE
          "1": L("fieldeffectstuff_011", { "1": "25" }), // Volleys deal {1} damage
        }),
      });
    }
    case 71:
      return L("movedefine_descadd_046"); // Automatically VOLLEYs to target ally.
    case 72:
      return L("movedefine_descadd_091"); // If ball is hittable: 
    case 73:
      return L("movedefine_descadd_096"); // Always goes where it's targeted.

    case 74:
    case 75:
    case 76:
      return L("movedefine_descadd_089", { // {0}{2}POW{1} to {target}.
        "0": `[sprIcon,${effect.eff == 76 ? "1" : "0"}]`,
        "2": `[sprIcon,${effect.eff == 74 ? "1" : "2"}]`,
        "1": boost,
        ...target_placeholders,
      });
    case 77:
    case 78:
    case 79:
      return L("movedefine_descadd_090", { // {0}{2}DEF{1} to {target}.
        "0": `[sprIcon,${effect.eff == 79 ? "1" : "0"}]`,
        "2": `[sprIcon,${effect.eff == 77 ? "1" : "2"}]`,
        "1": boost,
        ...target_placeholders,
      });
    case 81:
      return L("movedefine_descadd_098", { ...target_placeholders }); // Changes {target} trait to user's trait.
    case 82:
      if (effect.targ != 0) {
        return L("movedefine_descadd_099", { // {Target} Max STAMINA {0}.
          ...target_placeholders,
          "0": String(effect.pow),
        });
      } else {
        return L("movedefine_050", { "0": String(effect.pow) }); // {0} Max STAMINA.
      }
    case 83:
      return L("movedefine_descadd_101"); // This attack changes to the ally's first attack.
    case 84:
      return L("movedefine_descadd_102", { "0": String(effect.pow) }); // POW x{0}.
    case 85:
      return L("movedefine_descadd_105"); // If ally also BLOCKS:
    case 86:
      return L("movedefine_descadd_106", { "0": String(effect.pow) }); // Must charge up for {0} turns.
    case 87:
      return "";
    case 88:
      return L("movedefine_descadd_103", { "0": String(effect.pow) }); // If STAMINA is {0} or higher:
    case 89: {
      const ability = abilities[effect.pow];
      return L("movedefine_descadd_108", { // {Target} trait changes to {0} ({1}).
        ...target_placeholders,
        "0": L(ability.name),
        "1": L(ability.desc),
      });
    }
    case 90:
      return L("movedefine_053"); // If successful:
    case 91:
      return L("movedefine_descadd_109"); // Ignores Traits.
    case 92:
      return L("movedefine_descadd_111", { ...target_placeholders }); // Evenly shares STAMINA between self and {target}.
    case 93:
      return L("movedefine_descadd_112", { // {0} to the lowest DEF on {target}.
        ...target_placeholders,
        "0": boost,
      });
  }
  console.log(
    `Undefined Move Effect: E ${effect.eff} T ${effect.targ} P ${effect.pow}`,
  );
  return `E ${effect.eff} T ${effect.targ} P ${effect.pow}`;
}

export function getMoveDesc(move: Move, L: LocalizationFunction) {
  const desc = [];

  switch (move.id) {
    case "move":
      return L("movedefine_descadd_002"); // MOVE to a selected space.
    case "tagout":
      return L("movedefine_descadd_003"); // TAG OUT with a benched ally, only during defense.
    case "chance":
      return L("movedefine_descadd_004"); // Pass to an opponent and skip your turn. Can always be used.
    case "volley":
      return L("movedefine_descadd_005"); // A basic VOLLEY.
  }

  const attack = move.type < 3;

  switch (move.use) {
    case 1:
      desc.push(L("movedefine_descadd_007")); // Only used from back row.
      break;
    case 2:
      // If it auto targets front row and is Only used from net then ONLY is not included.
      if (move.targ == 4 && attack) {
        desc.push(L("movedefine_descadd_006")); // Used from net. Targets front row.
      } else {
        desc.push(L("movedefine_descadd_008")); // Only used from net.
      }
      break;
  }

  const hittable_eff = move.eff.find((effect) => effect.eff == 69);
  if (hittable_eff) {
    desc.push(
      hittable_eff.pow
        ? L("movedefine_descadd_009") // Only used when ball is hittable.
        : L("movedefine_descadd_107"), // Only used when ball is NOT hittable.
    );
  }
  if (
    move.type == Type.Volley &&
    !move.eff.some((eff) => eff.eff == 20) // Eff 20: Ball goes to TARGET. Does not have volley text
  ) {
    desc.push(L("movedefine_descadd_019")); // VOLLEY.
  }

  if (attack) {
    switch (move.targ) {
      case 1:
      case 3:
        desc.push(L("movedefine_descadd_015")); // Targets straight ahead.
        break;
      case 4:
        if (move.use == 2) {
          break;
        }
        desc.push(L("movedefine_descadd_012")); // Auto-targets front row.
        break;
      case 8:
        desc.push(L("movedefine_descadd_013")); // Auto-targets back row.
        break;
      case 12:
        desc.push(L("movedefine_descadd_014")); // Targets SIDEWAYS.
        break;
      case 13:
        desc.push(L("movedefine_descadd_010")); // Auto-targets nearest opponent.
        break;
    }

    if (move.pow <= -1) {
      desc.push(L("movedefine_descadd_018", { "0": String(-move.pow) })); // This attack does {0} damage.
    } else if (move.pow > -1 && move.pow < 0) {
      desc.push(L("movedefine_descadd_017", { "0": String(-move.pow * 100) })); // Damage equals {0}% of target's remaining STAMINA.
    }
    if (move.eff.length == 0 && desc.length == 0) {
      desc.push(L("movedefine_descadd_088", { "0": String(move.type) })); // A [sprIcon,{0}] ATTACK.
    } else if (
      (move.eff.length == 1 && move.targ == 0 && move.use == 0) ||
      move.id == "careful"
    ) {
      desc.unshift(L("movedefine_descadd_001")); // ATTACK.
    }
  } else {
    switch (move.targ) {
      case 5:
        desc.push(L("movedefine_descadd_110")); // Can target opponents or allies.
        break;
    }
  }

  const args = { joiningEffects: null };

  const desc_full = desc.concat(
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
  );

  if (move.targ == 7) {
    desc_full.push(L("movedefine_descadd_113")); // Can target opponents from the net.
  }
  return desc_full.join(" ");
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
  let stop_on_no_collide = false;
  if (friend) {
    const friend_rank = Math.floor(friend.plays.indexOf(props.move.id) / 4) + 1;
    let rank = 0;
    let found;
    for (const event of friend.events) {
      if (!event.collides && stop_on_no_collide) {
        break;
      }
      if (event.prereq.type[0] == 1) {
        if (!event.collides) {
          break;
        }
        stop_on_no_collide = true;
        continue;
      }
      friend_hearts += 1;
      if (event.rankup) {
        rank += 1;
      }
      if (rank == friend_rank) {
        found = true;
        break;
      }
    }
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

  const type =
    props.move.type == Type.DoubleBlock ? Type.Defence : props.move.type;

  const {
    color,
    darkColor,
    alt: altKey,
  } = TypeData[type] ?? TypeData[Type.Support];

  const alt = L("common.moveView.playText", {
    type: L("common.types." + altKey),
  });

  const style = {
    "--move-color": color,
    "--move-dark": darkColor,
    "--move-url": `url("/gameassets/sprType/${String(type)}.png")`,
  } as React.CSSProperties;

  const pow =
    type < 3 ? (
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
