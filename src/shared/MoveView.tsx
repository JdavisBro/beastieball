import TextTag from "./TextTag";
import styles from "./Shared.module.css";
import TypeColor from "../data/TypeColor";
import { Type } from "../data/MoveType";
import type { MoveType } from "../data/MoveType";

type Props = {
  move: MoveType;
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

export default function MoveView(props: Props): React.ReactElement {
  const { color, alt } = colors[props.move.type];
  const style = {
    "--move-color": color,
    "--move-url": `url("/gameassets/sprType/${String(props.move.type)}.png")`,
  } as React.CSSProperties;
  let pow = <></>;
  if (props.move.power !== null) {
    pow = <div className={styles.movepower}>{String(props.move.power)}</div>;
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
          <TextTag>{props.move.desc}</TextTag>
        </div>
      </div>
    </div>
  );
}
