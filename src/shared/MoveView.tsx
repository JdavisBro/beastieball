import TextTag from "./TextTag";
import styles from "./Shared.module.css";
import TypeColor from "../data/TypeColor";
import { Type } from "../data/MoveType";
import type { Move, MoveEffect } from "../data/Movedata";

type Props = {
  move: Move;
};

const colors: Record<number, { color: string; alt: string }> = {
  [Type.Body]: { color: TypeColor.Body, alt: "Mind Play" },
  [Type.Spirit]: { color: TypeColor.Spirit, alt: "Spirit Play" },
  [Type.Mind]: { color: TypeColor.Mind, alt: "Mind Play" },
  [Type.Pass]: { color: TypeColor.Pass, alt: "Volley Play" },
  [Type.Support]: { color: TypeColor.Support, alt: "Support Play" },
  [Type.Defence]: { color: TypeColor.Defence, alt: "Defence Play" },
  [Type.Unknown]: { color: TypeColor.Unknown, alt: "Unknown" },
  [Type.Sparkle]: { color: TypeColor.Sparkle, alt: "Unknown" },
  [Type.Movement]: { color: TypeColor.Movement, alt: "Move Play" },
};

// reuqired: targ=12 says Targets SIDEWAYS.

const TARGET_STRINGS: { [key: number]: string } = {
  0: "self",
  1: "ally",
  2: "active team",
  3: "target",
  5: "target's ally",
  6: "entire team",
};

const DEF_TARGET_STRINGS: { [key: number]: string } = {
  0: "self",
  1: "ally",
  2: "active team",
  3: "benched ally",
  6: "entire team",
};
function getEffectString(effect: MoveEffect, attack: boolean) {
  const boost =
    effect.pow > 0
      ? `[sprBoost,${Math.floor(effect.pow) - 1}]`
      : `[sprBoost,${3 + Math.abs(Math.floor(effect.pow)) - 1}]`;
  const target = (attack ? TARGET_STRINGS : DEF_TARGET_STRINGS)[effect.targ];

  const targetStart =
    target == undefined
      ? "Undefined"
      : target[0].toUpperCase() + target.slice(1);
  // const targetCaps = target.toUpperCase();

  const feels = effect.targ == 0 ? "Feel" : `${targetStart} feels`;

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
    case -7:
    case 7:
      return `SHIFTs ${target} to ${["back row", "front row", "opposite lane"][effect.pow]}${effect.eff == 7 ? " after hitting" : ""}.`;
    case 8:
      if (effect.targ == 0 && effect.pow < 0) {
        return `${effect.pow * 100} STAMINA.`;
      } else {
        return `HEALs ${target} +${effect.pow * 100}.`;
      }
    case 14:
      return `${feels} ${effect.pow} [sprStatus,3]NOISY (attracts attacks).`;
    case 15:
      return `[sprIcon,0][sprIcon,1][sprIcon,2]POW${boost} to ${target}.`;
    case 16:
      return `[sprIcon,0][sprIcon,1][sprIcon,2]DEF${boost} to ${target}.`;
    case 17:
      return `Can hit without volleying.`;
    case 20:
      if (effect.targ == 0) {
        return `Ball goes to self.`;
      } else {
        return `${targetStart}'s ball becomes VOLLEYed.`;
      }
    case 23:
      return `${feels} ${effect.pow} [sprStatus,6]SWEATY (losing stamina).`;
    case 26:
      return `${feels} ${effect.pow} [sprStatus,8]JAZZED (POW x1.5).`;
    case 27:
      return `${feels} ${effect.pow} [sprStatus,9]BLOCKED (POW x2/3).`;
    case 29:
      return `${feels} ${effect.pow} [sprStatus,10]TIRED (only basic actions).`;
    case 30:
      if (!attack) {
        return `Force ${target} to TAG OUT.`;
      } else {
        return `TAG OUT.`;
      }
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
          return "POW x2 when [sprStatus,6]SWEATY, [sprStatus,0]NERVOUS, [sprStatus,11]TENDER or [sprStatus,12]STRESSED.";
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
    case 36:
      return `Additional ${effect.pow * 100}% damage to ${target}.`;
    case 39:
      return `${effect.targ == 0 ? "Feel" : `${target} feels`} ${effect.pow} [sprStatus,12]STRESSED (becomes [sprStatus,10]TIRED)`;
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
    case 56:
      return `Build a WALL in front of ${target}.`;
    case 57:
      return ""; // shows on a few that are only used on back row but not others?
  }
  console.log(
    `Undefined Move Effect: E ${effect.eff} T ${effect.targ} P ${effect.pow}`,
  );
  return `E ${effect.eff} T ${effect.targ} P ${effect.pow}`;
}

export default function MoveView(props: Props): React.ReactElement {
  const { color, alt } = colors[props.move.type];
  const style = {
    "--move-color": color,
    "--move-url": `url("/gameassets/sprType/${String(props.move.type)}.png")`,
  } as React.CSSProperties;

  let desc_pre = "";
  let pow = <></>;

  const attack = props.move.pow != 0;

  if (props.move.use) {
    desc_pre = (attack ? "U" : "Only u") + "sed from ";
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
      // case 4:
      //   desc_pre = "Targets front row.";
      //   break;
      case 12:
        desc_pre = "Targets SIDEWAYS.";
        break;
    }

    if (props.move.pow < -1) {
      desc_pre += `Always does ${-props.move.pow} damage.`;
    } else if (props.move.pow < 0) {
      desc_pre += `Damage equals ${-props.move.pow * 100}% of target's remaining STAMINA.`;
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

  return (
    <div className={styles.movecontainer} style={style}>
      <div className={styles.moveviewimage} role="image" title={alt}>
        {pow}
      </div>
      <div className={styles.moveseparator}></div>
      <div className={styles.movecontent}>
        <div className={styles.movename}>{props.move.name}</div>
        <div className={styles.movedesc}>
          <TextTag>
            {desc_pre ? desc_pre + " " : ""}
            {props.move.eff
              .map((effect) => getEffectString(effect, attack))
              .join(" ")}
          </TextTag>
        </div>
      </div>
    </div>
  );
}
