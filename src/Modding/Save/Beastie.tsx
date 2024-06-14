import BEASTIE_DATA from "../../data/Beastiedata";
import { SaveBeastie } from "./SaveType";
import savestyles from "./Save.module.css";
import styles from "./Beastie.module.css";
import EventElement from "./EventElement";
import { VIBES } from "./BeastieValues";
import useBeastieRender from "../../shared/beastieRender/useBeastieRender";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

const altMap: { [key: number]: "colors" | "shiny" | "colors2" } = {
  0: "colors",
  1: "shiny",
  2: "colors2",
};

const altSearchMap: { [key: number]: string } = {
  0: "color",
  1: "raremorph",
  2: "alt",
};

function InfoBox(
  props: PropsWithChildren & { title: string },
): React.ReactElement {
  return (
    <div>
      <div className={savestyles.header}>{props.title}</div>
      <div className={savestyles.varcontainer}>{props.children}</div>
    </div>
  );
}

export default function Beastie(props: {
  beastie: SaveBeastie;
}): React.ReactElement {
  const save_beastie = props.beastie;
  const beastiedata = BEASTIE_DATA.get(props.beastie.specie);

  const searchParam = altSearchMap[Math.floor(props.beastie.color[0])];

  const beastieUrl = useBeastieRender(`/icons/${beastiedata?.name}.png`, {
    id: props.beastie.specie,
    colors: props.beastie.color.map((value) => value % 1.0),
    colorAlt: altMap[Math.floor(props.beastie.color[0])],
  });

  if (!beastiedata) {
    throw Error(`Invalid Beastie? ${save_beastie.specie}`);
  }
  // const [min_scale, max_scale] = beastiedata.scale;
  // const beastie_scale =
  //   (min_scale + save_beastie.scale * (max_scale - min_scale)) / max_scale;

  return (
    <div className={styles.beastie}>
      <div className={styles.beastiepreview}>
        <div className={savestyles.header}>Preview</div>
        <div className={savestyles.varcontainer}>
          <img src={beastieUrl} className={styles.beastieimage} />
        </div>
      </div>
      <div className={styles.beastieinfo}>
        <InfoBox title="Name">
          <span>{save_beastie.name}</span>
          {save_beastie.number != "" ? (
            <span className={styles.beastienumber}>#{save_beastie.number}</span>
          ) : null}
        </InfoBox>
        <InfoBox title="Level">{save_beastie.level}</InfoBox>
        <InfoBox title="Vibe">
          {VIBES[save_beastie.vibe] ?? save_beastie.vibe}
        </InfoBox>
        <InfoBox title="PID">{save_beastie.pid}</InfoBox>
        <InfoBox title="Beastiepedia">
          <Link
            to={`/beastiepedia/${beastiedata.name}?${searchParam}=${save_beastie.color.map((value) => value % 1.0).join(",")}`}
            target="_blank"
          >
            Preview in the Beastipedia
          </Link>
        </InfoBox>

        <InfoBox title="Events">
          <div className={styles.eventlist}>
            {save_beastie.event_log.events.map((event) => (
              <EventElement
                key={`${event.date}-${event.event}`}
                event={event}
              />
            ))}
          </div>
        </InfoBox>
      </div>
    </div>
  );
}
