import TextTag from "./TextTag";
import styles from "./Shared.module.css";
import { TypeData } from "../data/TypeColor";
import { Type, Move, MoveEffect } from "../data/MoveData";
import MoveModalContext from "./MoveModalContext";
import { useContext, useMemo } from "react";
import SOCIAL_DATA from "../data/SocialData";
import { useIsSpoilerFriend } from "./useSpoiler";
import { useLocalStorage } from "usehooks-ts";
import abilities from "../data/abilities";
import { abilityDesc } from "../Beastiepedia/Filter.module.css";

// reuqired: targ=12 says Targets SIDEWAYS.

const TARGET_STRINGS: Record<number, string> = {
  0: "self",
  1: "ally",
  2: "active team",
  3: "target",
  4: "target team",
  5: "target's ally",
  6: "entire team",
  7: "every fielded player",
  8: "other team",
  9: "nearest enemy",
  10: "front row active team",
  11: "active team",
};

const ALT_TARGET_STRINGS: Record<number, string> = {
  0: "self",
  1: "ally",
  2: "active team",
  3: "benched ally",
  6: "entire team",
  7: "entire field",
  8: "other team",
  9: "nearest enemy",

  11: "active team",
};

const FIELD_TARGET: Record<number, string> = {
  0: "Ally field",
  2: "Ally field",
  3: "Opponent field",
  5: "Opponent field",
  7: "Entire field",
};

function getEffectString(
  effect: MoveEffect,
  attack: boolean,
  alt_target: boolean,
  args: { joiningEffects: null | number },
  move: Move,
) {
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
  const target = (alt_target ? ALT_TARGET_STRINGS : TARGET_STRINGS)[
    effect.targ
  ];

  if (target == undefined) {
    console.log(`Target ${effect.targ} undefined!! ${effect}`);
  }

  const targetStart =
    target == undefined
      ? "Undefined"
      : target[0].toUpperCase() + target.slice(1);
  // const targetCaps = target.toUpperCase();

  const feels = !args.joiningEffects // Off completely is null, first in join is 0
    ? effect.targ == 0
      ? "Feel"
      : `${targetStart} feels`
    : "&";
  const dot =
    args.joiningEffects == null || args.joiningEffects == 1 ? "." : "";

  if (args.joiningEffects != null) {
    args.joiningEffects += 1;
  }

  switch (effect.eff) {
    case 0:
      return `[sprIcon,0]POW${boost} to ${target}.`;
    case 1:
      return `[sprIcon,1]POW${boost} to ${target}.`;
    case 2:
      return `[sprIcon,2]POW${boost} to ${target}.`;
    case 3:
      return `[sprIcon,0]DEF${boost} to ${target}.`;
    case 4:
      return `[sprIcon,1]DEF${boost} to ${target}.`;
    case 5:
      return `[sprIcon,2]DEF${boost} to ${target}.`;
    case 6:
      return `${feels} ${effect.pow} [sprStatus,0]NERVOUS (can't move)${dot}`;
    case -7:
    case 7:
      return `SHIFTs ${target} to ${["back row", "front row", "opposite lane", "3", "4", "5", "6", "opposite row"][effect.pow]}${attack && effect.eff > 0 ? " after hitting" : ""}.`;
    case 8: {
      const hp = Math.floor(Math.round(effect.pow * 10000000) / 100000); // rounds to 5dp then floors because funny float imprecision
      if (effect.pow < 0) {
        if (effect.targ == 0) {
          return `${hp} STAMINA.`;
        } else {
          return `${hp} STAMINA to ${target}.`;
        }
      } else {
        return `HEALs ${target} ${effect.pow > 0 ? "+" : ""}${hp}.`;
      }
    }
    case 10:
      return `+${effect.pow} ACTIONs.`;
    case 11:
      return "SWITCH places with fielded ally.";
    case 12:
      return `${feels} ${effect.pow < 0 ? "+" : ""}${Math.abs(effect.pow)} [sprStatus,1]ANGRY (only attacks)${dot}`;
    case 13:
      return `${feels} ${effect.pow} [sprStatus,2]SHOOK (can't attack)${dot}`;
    case 14:
      return `${feels} ${effect.pow} [sprStatus,3]NOISY (attracts attacks)${dot}`;
    case 15:
      return `[sprIcon,0][sprIcon,1][sprIcon,2]POW${boost} to ${target}.`;
    case 16:
      return `[sprIcon,0][sprIcon,1][sprIcon,2]DEF${boost} to ${target}.`;
    case 17:
      return `Can hit without volleying.`;
    case 18:
      if (effect.targ == 3) {
        return "Easy receive.";
      }
      return "Pass to an opponent and skip your turn. Can always be used.";
    case 19:
      return `${feels} ${effect.pow} [sprStatus,4]TOUGH (¼ damage)${dot}`;
    case 20:
      if (effect.targ == 0) {
        return `Ball goes to self.`;
      } else {
        return `${targetStart}'s ball becomes hittable.`;
      }
    case 22:
      return `${feels} ${effect.pow} [sprStatus,5]WIPED (must bench)${dot}`;
    case 23: {
      const feels2 =
        effect.pow > 0 && effect.targ == 7
          ? "Every non-[sprStatus,6]SWEATY fielded player feels "
          : feels + (args.joiningEffects ? " " : " +");
      return `${feels2}${Math.abs(effect.pow)} [sprStatus,6]SWEATY (losing stamina)${dot}`;
    }
    case -26:
    case 26:
      return `${feels} ${effect.pow} [sprStatus,8]JAZZED (POW +50%)${effect.eff < 0 && attack ? " before contact" : ""}${dot}`;
    case 27:
      return `${feels} ${effect.pow < 0 ? "+" : ""}${Math.abs(effect.pow)} [sprStatus,9]BLOCKED (POW x2/3)${dot}`;
    case 28:
      return `SWITCH places with ${target} without moving ball.`;
    case 29:
      return `${feels} ${effect.pow} [sprStatus,10]TIRED (only basic actions)${dot}`;
    case -30:
      return move.eff.length < 3
        ? `TAG OUT with ${ALT_TARGET_STRINGS[effect.targ]}.`
        : "TAG OUT.";
    case 30:
      if (alt_target) {
        return move.eff.length < 3 ? `TAG OUT with ${target}.` : "TAG OUT.";
      } else {
        return `Force ${target} to TAG OUT.`;
      }
    case 31:
      return `Transfer [sprBoost,2][sprBoost,5]BOOSTS to ${target}.`;
    case 32:
      return `Clears FEELINGs (except [sprStatus,1]ANGRY) from ${target}.`;
    case 33: {
      switch (effect.pow) {
        case 0:
          return "Add user's STAMINA to POW.";
        case 1:
          return "Strongest when user has less STAMINA.";

        case 5:
          return "POW x2 if target just TAGGED IN.";

        case 7:
          return "POW x1.5 if used to serve.";
        case 8:
          return "Strongest when target has more STAMINA.";
        case 9:
          return "POW x2 if target STAMINA is under 50.";
        case 10:
          return "POW +10 for each [sprBoost,0]BOOST on the user.";
        case 11:
          return "POW +100% for each [sprBoost,0]BOOST on target.";
        case 12:
          return "POW x2 when [sprStatus,6]SWEATY, [sprStatus,0]NERVOUS, [sprStatus,11]TENDER or [sprStatus,18]WEEPY.";
        case 13:
          return "POW x2 if target has a bad FEELING.";
        case 14:
          return "Ignores target's shields and [sprBoost,0][sprBoost,3]BOOSTS.";
        case 15:
          return "POW x1.5 if tied or behind on score.";
        case 16:
          return "Does more damage to back-row targets.";
        case 17:
          return "Ignores [sprStatus,9]BLOCKED.";
        case 18:
          return "POW x1.5 if user received the ball.";
        case 19:
          return "POW +50% for each volley between allies.";
        case 20:
          return "POW x2 if the user recently TAGGED IN.";
        case 21:
          return "POW +25% for each [sprBoost,3]BOOST on target.";
        case 22:
          return "Damages based on target's weakest DEF.";
        case 23:
          return "Damages based on target's strongest DEF.";
        case 25:
          return "Boosted by RALLY instead of weakened.";
        case 26:
          return "POW x1.5 if user changed row or lane this turn.";
        case 27:
          return "POW x2 when STAMINA is below 34.";

        case 29:
          return "POW x1.5 if there are any field effects.";
        case 30:
          return "POW x1.5 if user has 2+ ACTIONs.";
        case 31:
          return "POW x1.5 if user feels [sprStatus,8]JAZZED.";
        case 32:
          return "POW x¾ if user has any FEELINGs.";
      }
      console.log(
        `Undefined POW COND ${effect.pow}. E ${effect.eff} T ${effect.targ}`,
      );
      return `POW COND ${effect.pow}`;
    }
    case 34:
      return `Clears BOOSTS from ${target}.`;
    case 36:
      if (effect.targ == 5 && effect.pow == 1) {
        return "Damages both opponents.";
      }
      return `Additional ${effect.pow * 100}% damage to ${target}.`;
    case 38:
      return `${feels} ${effect.pow} [sprStatus,11]TENDER (DEF x½)${dot}`;
    case 39:
      return `${feels} ${effect.pow} [sprStatus,12]STRESSED (becomes [sprStatus,10]TIRED)${dot}`;
    case 40:
      return "Requires 2 ACTIONS.";
    case 41:
      return "Requires 3 ACTIONS.";
    case 42:
      return `${FIELD_TARGET[effect.targ]} gets +${effect.pow} TRAP (Tag-ins lose 8 stamina per trap).`;
    case 43:
      return `${FIELD_TARGET[effect.targ]} gets +${effect.pow} RALLY ([sprIcon,1] damage +15, [sprIcon,2] damage x¾).`;
    case 44:
      return `${FIELD_TARGET[effect.targ]} fills with RHYTHM (Healing and protection).`;
    case 45:
      return `${FIELD_TARGET[effect.targ]} fills with DREAD (No good feelings).`;
    case 46:
      if (effect.targ == 7) {
        return `Clears all FIELD EFFECTS.`;
      }
      break;
    case 47:
      if (effect.targ == 0) {
        return "Fully restores stamina and FEELINGS.";
      }
      return `Restores ${target}'s stamina and FEELINGS.`;
    case 52:
      return `Clears negative FEELINGs (except [sprStatus,1]ANGRY) from ${target}.`;
    case 53:
      args.joiningEffects = 0;
      return "";
    case 56:
      return `Build a BARRIER in front of ${target}.`;
    case 57:
      return ""; // shows on a few that are only used on back row but not others?
    case 60:
      return ""; // rowdy, displays as nothing, probably gives an extra rowdy point
    case 61:
      return "Can use even when [sprStatus,2]SHOOK, [sprStatus,10]TIRED or [sprStatus,5]WIPED.";
    case 63:
      return `Swaps Trait with ${TARGET_STRINGS[effect.targ]}.`;
    case 64:
      return "If ally field has RHYTHM:";
    case 69:
      return ""; // Only when hittable - i do this elsewhere since it needs to be first.
    case 70:
      return `${FIELD_TARGET[effect.targ]} gets ${effect.pow} QUAKE${move.eff.find((ieff) => ieff.eff == effect.eff) == effect ? " (Volleys deal 25 damage)" : ""}.`;
    case 71:
      return "Automatically VOLLEYs to target ally.";
    case 72:
      return "If ball is hittable:";
    case 73:
      return "Always goes where it's targeted.";

    case 74:
      return `[sprIcon,0][sprIcon,1]POW${boost} to ${target}.`;
    case 75:
      return `[sprIcon,0][sprIcon,2]POW${boost} to ${target}.`;
    case 76:
      return `[sprIcon,1][sprIcon,2]POW${boost} to ${target}.`;
    case 77:
      return `[sprIcon,0][sprIcon,1]DEF${boost} to ${target}.`;
    case 78:
      return `[sprIcon,0][sprIcon,2]DEF${boost} to ${target}.`;
    case 79:
      return `[sprIcon,1][sprIcon,2]DEF${boost} to ${target}.`;
    case 80:
      return `${feels} ${effect.pow} [sprStatus,18]WEEPY (ignores HEALS + BOOSTs)${dot}`;
    case 81:
      return `Changes ${target} trait to user's trait.`;
    case 82:
      return `${effect.pow} Max STAMINA.`;
    case 83:
      return `The attack changes to the ally's first attack.`;
    case 84:
      return `POW x${effect.pow}.`;
    case 85:
      return "If ally also BLOCKS:";
    case 86:
      return `Must charge up for ${effect.pow} turns.`;
    case 87:
      return "";
    case 88:
      return `If STAMINA is over ${effect.pow}:`;
    case 89: {
      const ability = abilities[effect.pow];
      return `Target and self trait changes to ${ability.name} (${ability.desc})`;
    }
  }
  console.log(
    `Undefined Move Effect: E ${effect.eff} T ${effect.targ} P ${effect.pow}`,
  );
  return `E ${effect.eff} T ${effect.targ} P ${effect.pow}`;
}

export function getMoveDesc(move: Move) {
  const desc = [];

  const attack = move.type < 3;

  switch (move.use) {
    case 1:
      desc.push("Only used from back row.");
      break;
    case 2:
      // If it auto targets front row and is Only used from net then ONLY is not included.
      desc.push(
        attack && move.targ == 4 ? "Used from net." : "Only used from net.",
      );
      break;
  }

  const hittable_eff = move.eff.find((effect) => effect.eff == 69);
  if (hittable_eff) {
    desc.push(
      hittable_eff.pow
        ? "Only used when ball is hittable."
        : "Only used when ball is NOT hittable.",
    );
  } else if (
    move.type == Type.Volley &&
    !move.eff.some((eff) => eff.eff == 20) // Eff 20: Ball goes to TARGET. Does not have volley text
  ) {
    desc.push("VOLLEY.");
  }

  if (attack) {
    switch (move.targ) {
      case 1:
      case 3:
        desc.push("Targets straight ahead.");
        break;
      case 4:
        // If it is Only used from net and Auto targets front row then Auto- is not included.
        desc.push(
          move.use != 2 ? "Auto-targets front row." : "Targets front row.",
        );
        break;
      case 8:
        desc.push("Auto-targets back row.");
        break;
      case 12:
        desc.push("Targets SIDEWAYS.");
        break;
      case 13:
        desc.push("Auto-targets nearest opponent.");
        break;
    }

    if (move.pow < -1) {
      desc.push(`Always does ${-move.pow} damage.`);
    } else if (move.pow > -1 && move.pow < 0) {
      desc.push(
        `Damage equals ${-move.pow * 100}% of target's remaining STAMINA.`,
      );
    }

    if (!desc.length && move.eff.length < 2) {
      if (move.eff.length == 0) {
        desc.push(`A [sprIcon,${move.type}] ATTACK.`);
      } else {
        desc.push("ATTACK.");
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
      learned_text = `Learned from ${friendSpoiler ? friend.name.slice(0, 2) + "..." : friend.name} at ${friend_hearts} hearts.`;
    }
  }

  var desc_str = useMemo(() => getMoveDesc(props.move), [props.move.id]);

  if (props.friendFilter && (!friend || friend.name != props.friendFilter)) {
    return null;
  }

  const type =
    props.move.type == Type.DoubleBlock ? Type.Defence : props.move.type;

  const { color, darkColor, alt } = TypeData[type] ?? TypeData[Type.Support];
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
            props.move.name.length > 18 ? styles.movenamelong : styles.movename
          }
        >
          {props.move.name}{" "}
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
              alt="View Beasties that learn this play."
              title="View Beasties that learn this play."
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
