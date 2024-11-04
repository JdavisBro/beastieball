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
import { useState } from "react";
import Sfx from "./Sfx";

type Props = {
  beastiedata: BeastieType;
};

type EvolutionType = {
  condition: number[];
  specie: string;
  value: number[];
};

const NUMBER_FORMAT = Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

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
    // Ignores Petula's second condition?
    (value) => value.specie == targetBeastieId && value.condition[0] != 10,
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

function getEvoConditionString(evo: EvolutionType, beastie: BeastieType) {
  switch (evo.condition[0]) {
    case 0:
      return `at level ${evo.value[0]}`;
    case 2:
      return `at ${evo.specie == "shroom_m" ? "Miconia Grove" : evo.specie == "shroom_s" ? "Cerise Atoll" : "somewhere"}`;
    case 8:
      return `after beating ${evo.value[0]} ${beastie.name}.`;
  }
  return "idk when though";
}

function ExpForLevel({ growth }: { growth: number }) {
  const [userLevel, setUserLevel] = useState(100);
  const level = Math.min(Math.max(userLevel, 0), 100);
  return (
    <InfoBox
      header={
        <>
          Exp for Level{" "}
          <input
            type="number"
            className={styles.levelInput}
            min={0}
            max={100}
            onChange={(event) => setUserLevel(Number(event.target.value))}
            value={level || ""}
          />
          <button onClick={() => setUserLevel(Math.max(1, level - 1))}>
            -
          </button>
          <button onClick={() => setUserLevel(Math.min(100, level + 1))}>
            +
          </button>
        </>
      }
    >
      {level ? Math.floor(level ** 3 * growth).toLocaleString() : "?"}
    </InfoBox>
  );
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
      <div className={styles.wrapinfoboxes}>
        <InfoBox header="Number">#{beastiedata.number}</InfoBox>
        <InfoBox header="Name">{beastiedata.name}</InfoBox>
        <InfoBox header="Development">{beastiedata.anim_progress}%</InfoBox>
        <InfoBox header="Metamorphosis">
          {preEvo ? (
            <div>
              Metamorphs from{" "}
              <Link to={`/beastiepedia/${preEvo.beastie.name}`}>
                {preEvo.beastie.name}
              </Link>{" "}
              {getEvoConditionString(preEvo.evolution, preEvo.beastie)}
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
              if (evolution.condition[0] == 10) {
                return null;
              }
              return (
                <div key={beastie.id + index}>
                  Metamorphs into{" "}
                  <Link to={`/beastiepedia/${beastie.name}`}>
                    {beastie.name}
                  </Link>{" "}
                  {getEvoConditionString(evolution, beastiedata)}
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
                    <TextTag>
                      {abilities[value].desc.replace(/\|/g, "")}
                    </TextTag>
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
          <br />
          <span className={styles.training}>
            <img
              src="/gameassets/sprSponsors/1.png"
              alt="Staying Power Fitness Sponsor"
              className={styles.gymLogo}
            />
            <span>{NUMBER_FORMAT.format(beastiedata.recruit_value)}</span>
          </span>
        </InfoBox>
        <InfoBox header="Ally Training">{training}</InfoBox>
        <ExpForLevel growth={beastiedata.growth} />
      </div>

      <MoveList
        movelist={beastiedata.attklist}
        learnset={beastiedata.learnset}
      />
      <ComboMove beastiedata={beastiedata} />

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
      <Sfx beastiedata={beastiedata} />
    </div>
  );
}
