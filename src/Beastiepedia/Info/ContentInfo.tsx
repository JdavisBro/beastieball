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
import InfoBox, { BoxHeader } from "../../shared/InfoBox";

const research_data: { [key: string]: number } = untyped_research_data;

type Props = {
  beastiedata: BeastieType;
};

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
          alt={`${beastiedata.name} Research Sample ${i + 1}`}
        />
      </a>,
    );
  }

  const preEvo = findBeastiePreevolution(beastiedata.family, beastiedata.id);
  const evolutions = beastiedata.evolution;
  const evolutionBeasties = evolutions?.map((value) =>
    BEASTIE_DATA.get(value.specie),
  );

  return (
    <div className={styles.info}>
      <div className={styles.inner}>
        <div className={styles.wrapinfoboxes}>
          <InfoBox header="Number">#{beastiedata.number}</InfoBox>
          <InfoBox header="Name">{beastiedata.name}</InfoBox>
          <InfoBox header="Metamorphosis">
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
                  <div key={beastie.id}>
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
          </InfoBox>
        </div>

        <InfoBox header="Description">{beastiedata.desc}</InfoBox>

        {
          <InfoBox header="Traits">
            {beastiedata.ability.map((value, index) =>
              value in abilities ? (
                <div key={value}>
                  {abilities[value].name}
                  {beastiedata.ability_hidden && index > 0
                    ? " (recessive): "
                    : ": "}
                  <TextTag>{abilities[value].desc}</TextTag>
                  <br />
                </div>
              ) : (
                `Unknown trait ${value}`
              ),
            )}
          </InfoBox>
        }
        <BoxHeader>Stat Distribution</BoxHeader>
        <StatDistribution beastiedata={beastiedata} />

        <div className={styles.wrapinfoboxes}>
          <InfoBox header="Recruit Condition">
            <TextTag>{beastiedata.recruit.description}</TextTag>
          </InfoBox>
          <InfoBox header="Ally Training">
            <TextTag>{training}</TextTag>
          </InfoBox>
        </div>

        <BoxHeader>Moves</BoxHeader>
        <MoveList
          movelist={beastiedata.attklist}
          learnset={beastiedata.learnset}
        />

        <InfoBox header="Research">
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
        </InfoBox>
      </div>
    </div>
  );
}
