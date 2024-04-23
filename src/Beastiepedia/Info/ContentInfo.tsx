import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import StatDistribution from "./StatDistribution";
import TextTag from "../../shared/TextTag";
import styles from "../Content.module.css";
import type { BeastieType } from "../../data/BeastieType";
import MoveList from "./MoveList";
import untyped_research_data from "../../data/research_data.json";
import designers from "../../data/designers.json";

const research_data: {
  [key: string]: Array<{ width: number; height: number }>;
} = untyped_research_data;

type Props = {
  beastiedata: BeastieType;
};

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

  return (
    <div className={styles.info}>
      <div className={styles.inner}>
        <div className={styles.header}>Number</div>
        <div className={styles.varcontainer}>
          <div className={styles.value}>#{beastiedata.number}</div>
        </div>
        <div className={styles.header}>Name</div>
        <div className={styles.varcontainer}>
          <div className={styles.value}>{beastiedata.name}</div>
        </div>
        <div className={styles.header}>Desciption</div>
        <div className={styles.varcontainer}>
          <div className={styles.value}>{beastiedata.desc}</div>
        </div>
        <div className={styles.header}>Stat Distribution</div>
        <StatDistribution beastiedata={beastiedata} />
        <div className={styles.header}>Recruit Condition</div>
        <div className={styles.varcontainer}>
          <div className={styles.value}>
            <TextTag>{beastiedata.recruit.description}</TextTag>
          </div>
        </div>
        <div className={styles.header}>Ally Training</div>
        <div className={styles.varcontainer}>
          <div className={styles.value}>
            <TextTag>{training}</TextTag>
          </div>
        </div>
        <div className={styles.header}>Moves</div>
        <MoveList
          movelist={beastiedata.attklist}
          learnset={beastiedata.learnset}
        />
        <div className={styles.header}>Research</div>
        <div className={styles.varcontainer}>
          <div className={styles.value}>
            <div className={styles.research}>
              <Gallery
                options={{
                  wheelToZoom: true,
                  zoom: true,
                  loop: false,
                  initialZoomLevel: 0.5,
                  secondaryZoomLevel: "fit",
                  showHideAnimationType: "fade",
                }}
                withDownloadButton={true}
              >
                {research_data[beastiedata.id].map((value, i) => (
                  <Item
                    original={`/gameassets/research/${beastiedata.id}_${i}.png`}
                    width={value.width}
                    height={value.height}
                    key={i}
                  >
                    {({ ref, open }) => (
                      <div key={`${beastiedata.id}_${i}`}>
                        <img
                          className={styles.researchimage}
                          ref={ref}
                          onClick={open}
                          src={`/gameassets/research/${beastiedata.id}_${i}.png`}
                        />
                      </div>
                    )}
                  </Item>
                ))}
              </Gallery>
            </div>
            Researcher{Array.isArray(beastiedata.designer) ? "s" : ""}:{" "}
            {Array.isArray(beastiedata.designer)
              ? beastiedata.designer.map((i) => designers[i]).join(", ")
              : designers[beastiedata.designer]}
            <br />
            Videographer: {designers[beastiedata.animator]}
          </div>
        </div>
      </div>
    </div>
  );
}
