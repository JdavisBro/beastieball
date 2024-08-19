import { Link } from "react-router-dom";

import StatDistribution from "./StatDistribution";
import TextTag from "../../shared/TextTag";
import styles from "./ContentInfo.module.css";
import type { BeastieType } from "../../data/BeastieData";
import MoveList from "./MoveList";
import designers from "../../data/raw/designers.json";
import abilities from "../../data/abilities";
import BEASTIE_DATA from "../../data/BeastieData";
import InfoBox, { BoxHeader } from "../../shared/InfoBox";
import ResearchCarousel from "./ResearchCarousel";
import ComboMove from "./ComboMove";

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
  2: "at Miconia Grove", // this could be a general one for sprecko's evolutions?? possibly with the value being which area
};

function getEvoConditionString(evo: EvolutionType) {
  return EVOLUTION_CONDITIONS[evo.condition[0]]
    ? EVOLUTION_CONDITIONS[evo.condition[0]].replace(
        /{(\d+)}/g,
        (match, index) => String(evo.value[Number(index)]) ?? match,
      )
    : "idk when though";
}

/* prettier-ignore */
const TRAINING_TYPE: Record<string, React.ReactElement> = {
  b: <img src="/gameassets/sprIcon/0.png" alt="Body" className={styles.trainingImage} />,
  h: <img src="/gameassets/sprIcon/1.png" alt="Spirit" className={styles.trainingImage} />,
  m: <img src="/gameassets/sprIcon/2.png" alt="Mind"className={styles.trainingImage} />,
};

export default function ContentInfo(props: Props): React.ReactNode {
  const beastiedata = props.beastiedata;

  const training = beastiedata.tyield
    .map((type, index, array) => {
      if (index % 2 != 0) return null;
      return (
        <span key={index} className={styles.training}>
          {index != 0 ? <br /> : null}
          <span>+{array[index + 1]} </span>
          {TRAINING_TYPE[(type as string)[0]]}
          <span>{(type as string)[1] == "a" ? "POW" : "DEF"}</span>
        </span>
      );
    })
    .filter((value) => !!value);

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

        <InfoBox header="Traits">
          <table className={styles.traittable}>
            <tbody>
              {beastiedata.ability.map((value, index) =>
                value in abilities ? (
                  <tr key={value}>
                    <td>
                      {abilities[value].name}
                      {beastiedata.ability_hidden && index > 0
                        ? " (recessive)"
                        : ""}
                    </td>
                    <td>
                      <TextTag>{abilities[value].desc}</TextTag>
                    </td>
                  </tr>
                ) : (
                  `Unknown trait ${value}`
                ),
              )}
            </tbody>
          </table>
        </InfoBox>

        <BoxHeader>Stat Distribution</BoxHeader>
        <StatDistribution beastiedata={beastiedata} />

        <div className={styles.wrapinfoboxes}>
          <InfoBox header="Recruit Condition">
            <TextTag>{beastiedata.recruit.description}</TextTag>
          </InfoBox>
          <InfoBox header="Ally Training">{training}</InfoBox>
          <InfoBox header="Exp For Level 100">
            {(100 ** 3 * beastiedata.growth).toLocaleString()}
          </InfoBox>
        </div>

        <BoxHeader>Plays</BoxHeader>
        <MoveList
          movelist={beastiedata.attklist}
          learnset={beastiedata.learnset}
        />

        <InfoBox header="Research">
          <div className={styles.research}>
            <ResearchCarousel beastieid={beastiedata.id} />
          </div>
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
        <ComboMove beastiedata={beastiedata} />
      </div>
    </div>
  );
}
