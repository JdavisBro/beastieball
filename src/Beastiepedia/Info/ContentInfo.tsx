import { Link } from "react-router-dom";

import StatDistribution from "./StatDistribution";
import TextTag from "../../shared/TextTag";
import styles from "../Content.module.css";
import type { BeastieType } from "../../data/BeastieType";
import MoveList from "./MoveList";
import untyped_research_data from "../../data/research_data.json";
import designers from "../../data/designers.json";
import abilities from "../../data/abilities";
import BEASTIE_DATA from "../../data/Beastiedata";

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

type EvolutionType = {
  condition: number[];
  specie: string;
  value: number[];
};

function findBeastiePreevolution(
  beastieId: string,
  targetBeastieId: string,
): {
  beastie: BeastieType;
  evolution: EvolutionType;
} | null {
  const beastie = BEASTIE_DATA.get(beastieId);
  if (!beastie || !beastie.evolution) {
    return null;
  }
  const evolution = beastie.evolution.find(
    (value) => value.specie == targetBeastieId,
  );
  if (evolution) {
    return { beastie, evolution };
  } else {
    const newEvolution = beastie.evolution
      .map((value) => {
        return findBeastiePreevolution(value.specie, targetBeastieId);
      })
      .find((value) => value);
    if (newEvolution) {
      return newEvolution;
    }
    return null;
  }
}

const EVOLUTION_CONDITIONS: { [key: number]: string } = {
  // "Evolves from/to BEASTIE (below strings with {N} replaced with value index)"
  0: "at level {0}",
};

function getEvoConditionString(evo: EvolutionType) {
  return EVOLUTION_CONDITIONS[evo.condition[0]]
    ? EVOLUTION_CONDITIONS[evo.condition[0]].replace(
        /{(\d+)}/g,
        (match, index) => String(evo.value[Number(index)]) ?? match,
      )
    : "idk when though";
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

  const preEvo = findBeastiePreevolution(beastiedata.family, beastiedata.id);
  const evolutions = beastiedata.evolution;
  const evolutionBeasties = evolutions?.map((value) =>
    BEASTIE_DATA.get(value.specie),
  );
  // if (
  //   preEvolutionBeastie &&
  //   preEvolutionBeastie.evolution &&
  //   preEvolutionBeastie.id != beastiedata.id
  // ) {
  //   while (preEvolutionData == undefined) {
  //     preEvolutionData = preEvolutionBeastie.evolution.find(
  //       (value) => value.specie == beastiedata.id,
  //     );
  //     preEvolutionBeastie.evolution.forEach((value) => )
  //     // preEvolutionBeastie = BEASTIE_DATA.get(preEvolutionData.specie);
  //   }
  // } else {
  //   preEvolutionBeastie = null;
  // }

  console.log(preEvo);
  return (
    <div className={styles.info}>
      <div className={styles.inner}>
        <div className={styles.wrapinfoboxes}>
          <InfoBox header="Number" value={`#${beastiedata.number}`} />
          <InfoBox header="Name" value={beastiedata.name} />
          <InfoBox
            header="Metamorphosis"
            value={
              <>
                {preEvo ? (
                  <div>
                    Metamorphs from{" "}
                    <Link to={`/beastiepedia/${preEvo.beastie.name}`}>
                      {preEvo.beastie.name}
                    </Link>{" "}
                    {getEvoConditionString(preEvo.evolution)}
                  </div>
                ) : (
                  <div>Does not Metamorph from any Beastie</div>
                )}
                {evolutions ? (
                  evolutionBeasties?.map((beastie, index) => {
                    if (!beastie) {
                      return null;
                    }
                    const evolution = evolutions[index];
                    return (
                      <div>
                        Metamorphs into{" "}
                        <Link to={`/beastiepedia/${beastie.name}`}>
                          {beastie.name}
                        </Link>{" "}
                        {getEvoConditionString(evolution)}
                      </div>
                    );
                  })
                ) : (
                  <div>Does not Metamorph into any Beastie</div>
                )}
              </>
            }
          />
        </div>

        <InfoBox header="Description" value={beastiedata.desc} />

        {
          <InfoBox
            header="Abilities"
            value={beastiedata.ability.map((value, index) =>
              value in abilities ? (
                <div key={value}>
                  {abilities[value].name}
                  {beastiedata.ability_hidden && index > 0
                    ? " (hidden): "
                    : ": "}
                  <TextTag>{abilities[value].desc}</TextTag>
                  <br />
                </div>
              ) : (
                `Unknown ability ${value}`
              ),
            )}
          />
        }
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
