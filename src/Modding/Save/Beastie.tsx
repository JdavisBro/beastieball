import BEASTIE_DATA from "../../data/Beastiedata";
import { SaveBeastie } from "./SaveType";
import styles from "./Beastie.module.css";
import EventElement from "./EventElement";

export default function Beastie(props: {
  beastie: SaveBeastie;
}): React.ReactElement {
  const save_beastie = props.beastie;
  const beastiedata = BEASTIE_DATA.get(props.beastie.specie);

  if (!beastiedata) {
    throw Error(`Invalid Beastie? ${save_beastie.specie}`);
  }
  const [min_scale, max_scale] = beastiedata.scale;
  const beastie_scale =
    (min_scale + save_beastie.scale * (max_scale - min_scale)) / max_scale;
  const big = beastie_scale > 1.0;

  return (
    <div className={styles.beastie}>
      <img
        src={`/icons/${beastiedata.name}.png`}
        style={{
          transform: `scale(${Math.min(beastie_scale, max_scale)})`,
        }}
        className={styles.beatieimage}
      />
      <div className={styles.beastieinfo}>
        <div>
          {save_beastie.name}#{save_beastie.number}
        </div>
        <div>Level: {save_beastie.level}</div>
        <div>{big ? "Too Big!" : ""}</div>
        {save_beastie.event_log.events.map((event) => (
          <EventElement event={event} />
        ))}
        <div>{save_beastie.pid}</div>
      </div>
    </div>
  );
}
