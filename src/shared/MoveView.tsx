import TextTag from "./TextTag";
import styles from "./Shared.module.css";
import TypeColor from "../data/TypeColor";
import { Type, Move, MoveEffect } from "../data/MoveData";
import MoveModalContext from "./MoveModalContext";
import { useContext } from "react";

type Props = {
  move: Move;
};

const colors: Record<number, { color: string; alt: string }> = {
  [Type.Body]: { color: TypeColor.Body, alt: "Mind Play" },
  [Type.Spirit]: { color: TypeColor.Spirit, alt: "Spirit Play" },
  [Type.Mind]: { color: TypeColor.Mind, alt: "Mind Play" },
  [Type.Volley]: { color: TypeColor.Pass, alt: "Volley Play" },
  [Type.Support]: { color: TypeColor.Support, alt: "Support Play" },
  [Type.Defence]: { color: TypeColor.Defence, alt: "Defence Play" },
  [Type.Unknown]: { color: TypeColor.Unknown, alt: "Unknown" },
  [Type.Sparkle]: { color: TypeColor.Sparkle, alt: "Unknown" },
  [Type.Movement]: { color: TypeColor.Movement, alt: "Move Play" },
  [Type.Swap]: { color: "#ffffff", alt: "???" },
};

// reuqired: targ=12 says Targets SIDEWAYS.

const TARGET_STRINGS: { [key: number]: string } = {
  0: "self",
  1: "ally",
  2: "active team",
  3: "target",
  5: "target's ally",
  6: "entire team",
  7: "Every fielded player",
};

const ALT_TARGET_STRINGS: { [key: number]: string } = {
  0: "self",
  1: "ally",
  2: "active team",
  3: "benched ally",
  6: "entire team",
  7: "entire field",
};

const FIELD_TARGET: Record<number, string> = {
  3: "Opponent field",
  7: "Entire field",
};

function getEffectString(
  effect: MoveEffect,
  attack: boolean,
  alt_target: boolean,
  args: { joiningEffects: null | number },
) {
  const boost =
    effect.pow > 0
      ? `[sprBoost,${Math.floor(effect.pow) - 1}]`
      : `[sprBoost,${3 + Math.abs(Math.floor(effect.pow)) - 1}]`;
  const target = (alt_target ? ALT_TARGET_STRINGS : TARGET_STRINGS)[
    effect.targ
  ];

  const targetStart =
    target == undefined
      ? "Undefined"
      : target[0].toUpperCase() + target.slice(1);
  // const targetCaps = target.toUpperCase();

  const feels = !args.joiningEffects // Off completely is null, first in join is 0
    ? effect.targ == 0
      ? "Feel"
      : `${targetStart} feels`
    : "+";
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
    case 8:
      if (effect.pow < 0) {
        if (effect.targ == 0) {
          return `${effect.pow * 100} STAMINA.`;
        } else {
          return `${effect.pow * 100} STAMINA to ${target}.`;
        }
      } else {
        return `HEALs ${target} ${effect.pow > 0 ? "+" : ""}${effect.pow * 100}.`;
      }
    case 10:
      return "+1 ACTIONs.";
    case 11:
      return `Switch places with ${target}.`;
    case 12:
      return `${feels} ${effect.pow} [sprStatus,1]ANGRY (only attacks)${dot}`;
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
        return "Easy recieve.";
      }
      return "Volley to an opponent and skip your attack. Can always be used";
    case 19:
      return `${feels} ${effect.pow} [sprStatus,4]TOUGH (1/4 damage)${dot}`;
    case 20:
      if (effect.targ == 0) {
        return `Ball goes to self.`;
      } else {
        return `${targetStart}'s ball becomes VOLLEYed.`;
      }
    case 22:
      return `${feels} ${effect.pow} [sprStatus,5]WIPED (must bench)${dot}`;
    case 23:
      return `${feels} ${effect.pow} [sprStatus,6]SWEATY (losing stamina)${dot}`;
    case -26:
    case 26:
      return `${feels} ${effect.pow} [sprStatus,8]JAZZED (POW x1.5)${effect.eff < 0 && attack ? " before contact" : ""}${dot}`;
    case 27:
      return `${feels} ${effect.pow} [sprStatus,9]BLOCKED (POW x2/3)${dot}`;
    case 28:
      return `SWITCH places with ${target} without moving ball.`;
    case 29:
      return `${feels} ${effect.pow} [sprStatus,10]TIRED (only basic actions)${dot}`;
    case 30:
      if (alt_target) {
        return `TAG OUT with ${target}.`;
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
          return "Strongest when user has more STAMINA.";
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
          return "POW +10 for each [sprBoost,0] BOOST on the user.";
        case 11:
          return "POW +50% for each [sprBoost,1] BOOST on target.";
        case 12:
          return "POW x2 when [sprStatus,6]SWEATY, [sprStatus,0]NERVOUS, or [sprStatus,11]TENDER.";
        case 13:
          return "POW x1.5 if target has a bad FEELING.";
        case 14:
          return "Ignores target's shields and [sprBoost,2][sprBoost,5]BOOSTS.";
        case 15:
          return "POW x1.5 if tied or behind on score.";
        case 16:
          return "Stronger when recieved in the back.";
        case 17:
          return "Ignores [sprStatus,9]BLOCKED.";
        case 18:
          return "POW x1.5 if user recieved the ball.";
        case 19:
          return "POW +50% for each volley.";
        case 20:
          return "POW x2 if user just TAGGED IN.";
        case 21:
          return "POW +25% for each [sprBoost,4]BOOST on target.";
        case 22:
          return "Damages based on target's weakest DEF.";
        case 23:
          return "Damages based on target's strongest DEF.";
      }
      return "";
    }
    case 34:
      return `Clears BOOSTS from ${target}`;
    case 36:
      if (effect.targ == 5 && effect.pow == 1) {
        return "Damages both opponents.";
      }
      return `Additional ${effect.pow * 100}% damage to ${target}.`;
    case 38:
      return `${feels} ${effect.pow} [sprStatus,11]TENDER (defenses[sprBoost,4])${dot}`;
    case 39:
      return `${feels} ${effect.pow} [sprStatus,12]STRESSED (becomes [sprStatus,10]TIRED)${dot}`;
    case 40:
      return "Requires 2 ACTIONS.";
    case 41:
      return "Requires 3 ACTIONS.";
    case 42:
      return `${FIELD_TARGET[effect.targ]} gets +${effect.pow} TRAP (Tag-ins lose 8 stamina per trap).`;
    case 43:
      return `${FIELD_TARGET[effect.targ]} gets +${effect.pow} RALLY ([sprIcon,1]POW +50%, [sprIcon,2]POW -25%).`;
    case 44:
      return `${targetStart} gets +${effect.pow} RHYTHM (Healing and protection).`;
    case 45:
      return `${targetStart} gets +${effect.pow} DREAD (No good feelings).`;
    case 46:
      if (effect.targ == 7) {
        return `Clears all FIELD EFFECTS.`;
      }
      break;
    case 47:
      if (effect.targ == 0) {
        return "Fully restores stamina and FEELINGS.";
      }
      return `Fully restores ${target}'s stamina and FEELINGS.`; // doesn't happen but maybe
    case 53:
      args.joiningEffects = 0;
      return "";
    case 56:
      return `Build a WALL in front of ${target}.`;
    case 57:
      return ""; // shows on a few that are only used on back row but not others?
    case 61:
      return "Can use even when [sprStatus,2]SHOOK or [sprStatus,10]TIRED.";
    case 63:
      return `Swaps traits with ${TARGET_STRINGS[effect.targ]}.`;
    case 64:
      return "If ally field has RHYTHM: ";
  }
  console.log(
    `Undefined Move Effect: E ${effect.eff} T ${effect.targ} P ${effect.pow}`,
  );
  return `E ${effect.eff} T ${effect.targ} P ${effect.pow}`;
}

export default function MoveView(props: Props): React.ReactElement {
  const { color, alt } = colors[props.move.type]
    ? colors[props.move.type]
    : { color: "#ffffff", alt: "a" };
  const style = {
    "--move-color": color,
    "--move-url": `url("/gameassets/sprType/${String(props.move.type)}.png")`,
  } as React.CSSProperties;

  let desc_pre = "";
  let pow = <></>;

  const attack = props.move.type < 3;

  if (props.move.type == Type.Volley) {
    desc_pre = "VOLLEY.";
  }
  if (props.move.use) {
    if (desc_pre) {
      desc_pre += " ";
    }
    desc_pre += "Only used from ";
  }
  switch (props.move.use) {
    case 1:
      desc_pre += "back row.";
      break;
    case 2:
      desc_pre += "net.";
      break;
  }

  if (attack) {
    switch (props.move.targ) {
      case 1:
        if (desc_pre) {
          desc_pre += " ";
        }
        desc_pre += "Targets straight ahead.";
        break;
      case 4:
        if (desc_pre) {
          desc_pre += " ";
        }
        desc_pre += attack ? "Auto-targets front row." : "Targets front row.";
        break;
      case 8:
        if (desc_pre) {
          desc_pre += " ";
        }
        desc_pre += attack ? "Auto-targets back row." : "Targets back row.";
        break;
      case 12:
        if (desc_pre) {
          desc_pre += " ";
        }
        desc_pre += "Targets SIDEWAYS.";
        break;
      case 13:
        if (desc_pre) {
          desc_pre += " ";
        }
        desc_pre += "Auto-targets nearest opponent.";
        break;
    }

    if (props.move.pow <= -1) {
      desc_pre += `${desc_pre ? " " : ""}Always does ${-props.move.pow} damage.`;
    } else if (props.move.pow < 0) {
      desc_pre += `${desc_pre ? " " : ""}Damage equals ${-props.move.pow * 100}% of target's remaining STAMINA.`;
    }

    if (!desc_pre) {
      desc_pre = "ATTACK.";
    }
    pow = (
      <div className={styles.movepower}>
        {String(Math.max(0, props.move.pow))}
      </div>
    );
  }

  const setMoveModal = useContext(MoveModalContext);

  const args = { joiningEffects: null };

  return (
    <div className={styles.movecontainer} style={style}>
      <div className={styles.moveviewbar}>
        <div className={styles.moveviewimage} title={alt}></div>
        {pow}
      </div>
      <div className={styles.moveseparator}></div>
      <div className={styles.movecontent}>
        <div className={styles.movename}>
          {props.move.name}{" "}
          <img
            src="/gameassets/sprMainmenu/6.png"
            className={styles.movelearnerbutton}
            tabIndex={0}
            onClick={() => {
              if (setMoveModal) {
                setMoveModal(props.move);
              }
            }}
            role="button"
            alt="View Beasties that learn this play."
            title="View Beasties that learn this play."
          />
        </div>
        <div className={styles.movedesc}>
          <TextTag>
            {desc_pre ? desc_pre + " " : ""}
            {props.move.eff
              .map((effect) =>
                getEffectString(
                  effect,
                  attack,
                  !attack && (props.move.targ == 0 || props.move.targ == 8),
                  args,
                ),
              )
              .filter((effect) => !!effect)
              .join(" ")}
          </TextTag>
        </div>
      </div>
    </div>
  );
}
