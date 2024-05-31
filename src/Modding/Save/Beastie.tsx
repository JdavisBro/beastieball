import BEASTIE_DATA from "../../data/Beastiedata";
import { SaveBeastie } from "./SaveType";
import styles from "./Beastie.module.css";
import EventElement from "./EventElement";
import { VIBES } from "./BeastieValues";

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
      <div className={styles.beastiepreview}>
        <img
          src={`/icons/${beastiedata.name}.png`}
          style={{
            transform: `scale(${Math.min(beastie_scale, max_scale)})`,
          }}
          className={styles.beatieimage}
        />
        {save_beastie.color.some((value) => value != 0.5) ? (
          <div>Displayed Colors Incorrect</div>
        ) : null}
        {big ? <div>Displayed Size Incorrect</div> : null}
      </div>
      <div className={styles.beastieinfo}>
        <div className={styles.beastiename}>
          <span>{save_beastie.name}</span>
          {save_beastie.number != "" ? (
            <span className={styles.beastienumber}>#{save_beastie.number}</span>
          ) : null}
        </div>
        <div>Level: {save_beastie.level}</div>
        <div>Vibe: {VIBES[save_beastie.vibe] ?? save_beastie.vibe}</div>
        <div className={styles.eventlist}>
          {save_beastie.event_log.events.map((event) => (
            <EventElement key={`${event.date}-${event.event}`} event={event} />
          ))}
        </div>
        <div>PID: {save_beastie.pid}</div>
      </div>
    </div>
  );
}
