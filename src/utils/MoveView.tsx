import TextTag from "./TextTag";
import styles from "../Shared.module.css";
import TypeColor from "../data/TypeColor";
import { Type } from "../data/MoveType";
import type { MoveType } from "../data/MoveType";

type Props = {
  move: MoveType;
};

export default function MoveView(props: Props): React.ReactElement {
  const colors: Map<Type, string> = new Map([
    [Type.Body, TypeColor.Body],
    [Type.Spirit, TypeColor.Spirit],
    [Type.Mind, TypeColor.Mind],
    [Type.Pass, TypeColor.Pass],
    [Type.Support, TypeColor.Support],
    [Type.Defence, TypeColor.Defence],
    [Type.Unknown, TypeColor.Unknown],
    [Type.Sparkle, TypeColor.Sparkle],
    [Type.Movement, TypeColor.Movement],
  ]);
  const color = colors.get(props.move.type);
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
      <div className={styles.moveviewimage}>{pow}</div>
      <div className={styles.moveseparator}></div>
      <div className={styles.movecontent}>
        <div className={styles.movename}>{props.move.name}</div>
        <div className={styles.movedesc}>
          <TextTag text={props.move.desc}></TextTag>
        </div>
      </div>
    </div>
  );
}
