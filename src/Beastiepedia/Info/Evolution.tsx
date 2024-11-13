import { Link } from "react-router-dom";
import BEASTIE_DATA, { BeastieType, Condition } from "../../data/BeastieData";
import InfoBox from "../../shared/InfoBox";
import {
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "../../shared/useSpoiler";
import { useState } from "react";
import TextTag from "../../shared/TextTag";

type EvolutionType = {
  condition: number[];
  specie: string;
  value: number[] | Condition[];
};

type Evo = {
  beastie: BeastieType;
  evolution: EvolutionType;
};

function findBeastiePreevolutions(
  beastieId: string,
  targetBeastieId: string,
): Evo[] | null {
  const beastie = BEASTIE_DATA.get(beastieId);
  if (!beastie || !beastie.evolution) {
    return null;
  }
  const evolution = beastie.evolution.find(
    // Ignores Petula's second condition?
    (value) => value.specie == targetBeastieId && value.condition[0] != 10,
  );
  if (evolution) {
    return [{ beastie, evolution }];
  } else {
    const newEvolution = beastie.evolution
      .map((value) => {
        return findBeastiePreevolutions(value.specie, targetBeastieId);
      })
      .filter((value) => !!value)
      .reduce((accum: Evo[], value: Evo[]) => [...accum, ...value], []);
    if (newEvolution) {
      return newEvolution;
    }
    return null;
  }
}

const LOCATION_CONDS: Record<string, string> = {
  shroom_b: "The Rutile Preserve",
  shroom_m: "Miconia Grove",
  shroom_s: "Cerise Atoll",
};

function EvoCondition({
  evolution,
  beastie,
}: {
  evolution: EvolutionType;
  beastie: BeastieType;
}): React.ReactNode {
  const [descShown, setDescShown] = useState(false);

  switch (evolution.condition[0]) {
    case 0:
      return `at level ${evolution.value[0]}`;
    case 2:
      return `at ${LOCATION_CONDS[evolution.specie] ?? "somewhere"}`;
    case 7:
      return (
        <>
          <span
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => setDescShown(!descShown)}
            role="button"
          >
            🛈
          </span>
          <div style={{ display: descShown ? "block" : "none" }}>
            <TextTag>- {(evolution.value[0] as Condition).description}</TextTag>
          </div>
        </>
      );
    case 8:
      return `after beating ${evolution.value[0]} ${beastie.name}.`;
  }
  return "idk when though";
}

function EvoText({
  evo,
  fromBeastie,
  direction,
  isSpoiler,
}: {
  evo: { beastie: BeastieType; evolution: EvolutionType };
  fromBeastie: BeastieType;
  direction: string;
  isSpoiler: boolean;
}) {
  return (
    <div>
      Metamorphs {direction}{" "}
      <Link to={`/beastiepedia/${evo.beastie.name}`}>
        {isSpoiler ? "???" : evo.beastie.name}
      </Link>{" "}
      <EvoCondition evolution={evo.evolution} beastie={fromBeastie} />
    </div>
  );
}

export default function Evolution({
  beastiedata,
}: {
  beastiedata: BeastieType;
}) {
  const [spoilerMode] = useSpoilerMode();
  const [beastieSeen] = useSpoilerSeen();

  const preEvos = findBeastiePreevolutions(beastiedata.family, beastiedata.id);
  const evolutions = beastiedata.evolution;
  const evolutionBeasties = evolutions?.map((value) =>
    BEASTIE_DATA.get(value.specie),
  );

  const [showEvolution, setShowEvolution] = useState("");

  return (
    <InfoBox header="Metamorphosis">
      {preEvos?.length ? (
        preEvos.map((evo, index) => (
          <EvoText
            key={`${evo.beastie.id}${index}`}
            evo={evo}
            fromBeastie={evo.beastie}
            direction="from"
            isSpoiler={
              evo
                ? spoilerMode == SpoilerMode.OnlySeen &&
                  !beastieSeen[evo.beastie.id]
                : false
            }
          />
        ))
      ) : (
        <div>Does not Metamorph from any Beastie</div>
      )}

      {showEvolution == beastiedata.id || spoilerMode == SpoilerMode.All ? (
        evolutions ? (
          evolutionBeasties?.map((beastie, index) => {
            if (!beastie) {
              return null;
            }
            const evolution = evolutions[index];
            if (evolution.condition[0] == 10) {
              return null;
            }
            return (
              <EvoText
                key={beastie.id + index}
                evo={{ beastie, evolution }}
                fromBeastie={beastiedata}
                direction="to"
                isSpoiler={
                  spoilerMode == SpoilerMode.OnlySeen &&
                  !beastieSeen[beastie.id]
                }
              />
            );
          })
        ) : (
          <div>Does not Metamorph into any Beastie</div>
        )
      ) : (
        <div onClick={() => setShowEvolution(beastiedata.id)}>
          Possible spoiler. Click to reveal.
        </div>
      )}
    </InfoBox>
  );
}
