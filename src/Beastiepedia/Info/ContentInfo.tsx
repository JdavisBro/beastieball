import StatDistribution from "./StatDistribution";
import TextTag from "../../shared/TextTag";
import styles from "../Content.module.css";
import type { BeastieType } from "../../data/BeastieType";
import MoveList from "./MoveList";
import untyped_research_data from "../../data/research_data.json";
import designers from "../../data/designers.json";
import abilities from "../../data/abilities";

const research_data: { [key: string]: number } = untyped_research_data;

type Props = {
  beastiedata: BeastieType;
};

function InfoBox(props: {
  header: string;
  value: string | React.ReactNode;
}): React.ReactNode {
  return (
    <div>
      <div className={styles.header}>{props.header}</div>
      <div className={styles.varcontainer}>
        <div className={styles.value}>{props.value}</div>
      </div>
    </div>
  );
}

export default function ContentInfo(props: Props): React.ReactNode {
  const beastiedata = props.beastiedata;
  let training = "";

  for (let i = 0; i < beastiedata.tyield.length; i += 2) {
    const type = String(beastiedata.tyield[i]);
    const value = Number(beastiedata.tyield[i + 1]);
    training += `${training == "" ? "" : "\n"}+${value} `;

    switch (type[0]) {
      case "b":
        // body
        training += "[sprIcon,0]";
        break;

      case "h":
        // spirit (heart)
        training += "[sprIcon,1]";
        break;

      case "m":
        // mind
        training += "[sprIcon,2]";
        break;
    }

    switch (type[1]) {
      case "a":
        training += "POW";
        break;

      case "d":
        training += "DEF";
        break;
    }
  }

  const research: React.ReactElement[] = [];
  for (let i = 0; i < research_data[beastiedata.id]; i++) {
    research.push(
      <a
        key={`${beastiedata.id}_${i}`}
        href={`/gameassets/research/${beastiedata.id}_${i}.png`}
        target="_blank"
      >
        <img
          className={styles.researchimage}
          src={`/gameassets/research/${beastiedata.id}_${i}.png`}
        />
      </a>,
    );
  }

  return (
    <div className={styles.info}>
      <div className={styles.inner}>
        <div className={styles.wrapinfoboxes}>
          <InfoBox header="Number" value={`#${beastiedata.number}`} />
          <InfoBox header="Name" value={beastiedata.name} />
        </div>

        <InfoBox header="Description" value={beastiedata.desc} />

        <InfoBox
          header="Abilities"
          value={beastiedata.ability.map((value, index) => (
            <div key={value}>
              {abilities[value].name}
              {beastiedata.ability_hidden && index > 0 ? " (hidden): " : ": "}
              <TextTag>{abilities[value].desc}</TextTag>
              <br />
            </div>
          ))}
        />

        <div className={styles.header}>Stat Distribution</div>
        <StatDistribution beastiedata={beastiedata} />

        <div className={styles.wrapinfoboxes}>
          <InfoBox
            header="Recruit Condition"
            value={<TextTag>{beastiedata.recruit.description}</TextTag>}
          />
          <InfoBox
            header="Ally Training"
            value={<TextTag>{training}</TextTag>}
          />
        </div>

        <div className={styles.header}>Moves</div>
        <MoveList
          movelist={beastiedata.attklist}
          learnset={beastiedata.learnset}
        />

        <InfoBox
          header="Research"
          value={
            <>
              <div className={styles.research}>{research}</div>
              Researcher{Array.isArray(beastiedata.designer) ? "s" : ""}:{" "}
              {Array.isArray(beastiedata.designer)
                ? beastiedata.designer.map((i) => designers[i]).join(", ")
                : designers[beastiedata.designer]}
              <br />
              Videographer{Array.isArray(beastiedata.animator) ? "s" : ""}:{" "}
              {Array.isArray(beastiedata.animator)
                ? beastiedata.animator.map((i) => designers[i]).join(", ")
                : designers[beastiedata.animator]}
            </>
          }
        />
      </div>
    </div>
  );
}
