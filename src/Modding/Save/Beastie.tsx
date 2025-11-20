import BEASTIE_DATA from "../../data/BeastieData";
import { SaveBeastie } from "./SaveType";
import styles from "./Beastie.module.css";
import EventElement from "./EventElement";
import InfoBox from "../../shared/InfoBox";
import TeamBeastie from "../../Team/Beastie/Beastie";

export default function Beastie(props: {
  beastie: SaveBeastie;
}): React.ReactElement {
  const save_beastie = props.beastie;
  if (save_beastie._ != "class_beastie") {
    console.log("not beastie", save_beastie);
    return <></>;
  }

  const beastiedata = BEASTIE_DATA.get(props.beastie.specie);

  if (!beastiedata) {
    throw Error(`Invalid Beastie? ${save_beastie.specie}`);
  }

  const has_events = save_beastie.event_log.events.length;

  return (
    <div className={has_events ? styles.beastie : styles["beastie-noevent"]}>
      <TeamBeastie teamBeastie={props.beastie as SaveBeastie} />
      {has_events ? (
        <InfoBox header="Events">
          <div className={styles.eventlist}>
            {save_beastie.event_log.events.map((event) => (
              <EventElement
                key={`${event.date}-${event.event}`}
                event={event}
              />
            ))}
          </div>
        </InfoBox>
      ) : null}
    </div>
  );
}
