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
import useLocalization from "../../localization/useLocalization";

type EvolutionType = {
  condition: number[];
  specie: string;
  value: Array<number | Condition>;
};

type Evo = {
  beastie: BeastieType;
  evolution: EvolutionType;
  seen?: boolean;
};

function findBeastiePreevolutions(
  beastieId: string,
  targetBeastieId: string,
): Evo[] {
  const beastie = BEASTIE_DATA.get(beastieId);
  if (!beastie || !beastie.evolution) {
    return [];
  }
  const evolutions = beastie.evolution.filter(
    (value) => value.specie == targetBeastieId,
  );
  if (evolutions.length) {
    return evolutions.map((evolution) => {
      return { beastie, evolution: structuredClone(evolution) };
    });
  } else {
    const newEvolution = beastie.evolution
      .map((value) => {
        return findBeastiePreevolutions(value.specie, targetBeastieId);
      })
      .filter((value) => !!value)
      .reduce((accum: Evo[], value: Evo[]) => [...accum, ...value], [])
      .filter(
        (evo, index, array) =>
          array.findIndex((e) => evo.beastie.id == e.beastie.id) == index,
      );
    if (newEvolution) {
      return newEvolution;
    }
    return [];
  }
}

const LOCATION_CONDS: Record<string, string> = {
  shroom_b: "_map_Rutile Preserve",
  shroom_s: "_map_Cerise Atoll",
  shroom_m: "_map_Miconia Grove",
  tricky: "_map_Cordia Lake",
};

function EvoCondInfo({ children }: { children: React.ReactNode }) {
  const [descShown, setDescShown] = useState(false);

  return (
    <>
      <span
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setDescShown(!descShown)}
        role="button"
      >
        {" "}
        🛈
      </span>
      <div
        style={{
          display: descShown ? "block" : "none",
          whiteSpace: "pre-line",
        }}
      >
        {children}
      </div>
    </>
  );
}

function EvoCondition({
  condition,
  value,
  specie,
}: {
  condition: number;
  value: number | Condition;
  specie: string;
}): React.ReactNode {
  const { L, getLink } = useLocalization();

  switch (condition) {
    case 0:
      return L("beastiepedia.info.metamorphosis.level", {
        level: String(value),
      });
    case 2: {
      const beastieName = L(BEASTIE_DATA.get(specie)?.name ?? "someone");
      return (
        <>
          {L("beastiepedia.info.metamorphosis.location", {
            location: L(LOCATION_CONDS[specie] ?? "somewhere"),
          })}
          <Link
            to={getLink(`/map/?marker=${beastieName}`)}
            title={L("beastiepedia.info.metamorphosis.viewInMap")}
          >
            <img
              src="/gameassets/sprMainmenu/2.png"
              style={{
                height: "1.2em",
                verticalAlign: "middle",
                filter: "brightness(0.3)",
              }}
            />
          </Link>
        </>
      );
    }
    case 3:
      return L("beastiepedia.info.metamorphosis.relationships", {
        num: String(value),
      });
    case 4:
      return (
        <>
          {L("beastiepedia.info.metamorphosis.homeYearning", {
            level: String(value),
          })}
          <EvoCondInfo>
            {L("beastiepedia.info.metamorphosis.homeYearningMore")}
          </EvoCondInfo>
        </>
      );
    case 5:
    case 6: {
      const keyBase = condition == 6 ? "variantVariant" : "variantRegular";
      return (
        <>
          {L("beastiepedia.info.metamorphosis." + keyBase, {
            level: String(value),
          })}
          <EvoCondInfo>
            {L("beastiepedia.info.metamorphosis." + keyBase + "Raremorph")}
          </EvoCondInfo>
        </>
      );
    }
    case 7:
      return (
        <EvoCondInfo>
          <TextTag>
            {L("beastiepedia.info.metamorphosis.ancientMorePrefix")}
            {L((value as Condition).description)}
          </TextTag>
        </EvoCondInfo>
      );
    case 8:
      return L("beastiepedia.info.metamorphosis.petula", {
        num: String(value),
      });
  }
  return L("beastiepedia.info.metamorphosis.fallback");
}

function EvoText({
  evo,
  into,
  isSpoiler,
}: {
  evo: { beastie: BeastieType; evolution: EvolutionType };
  into: boolean;
  isSpoiler: boolean;
}) {
  const { L, getLink } = useLocalization();

  const conds: React.ReactNode[] = [];
  for (let i = 0; i < evo.evolution.condition.length; i++) {
    if (i > 0) {
      conds.push(L("beastiepedia.info.metamorphosis.joiner"));
    }
    conds.push(
      <EvoCondition
        key={evo.beastie.id + i}
        condition={evo.evolution.condition[i]}
        value={evo.evolution.value[i]}
        specie={evo.evolution.specie}
      />,
    );
  }

  const evoName = L(evo.beastie.name);
  return (
    <div>
      {L(
        into
          ? "beastiepedia.info.metamorphosis.to"
          : "beastiepedia.info.metamorphosis.from",
      )}
      <Link to={getLink(`/beastiepedia/${evoName}`)}>
        {isSpoiler ? L("common.spoiler") : evoName}
      </Link>
      {conds}
    </div>
  );
}

const HIDDEN_CONDS = [9, 10, 11];
const HIDDEN_PRE_CONDS = [7];

function squashEvolutions(evoList: Evo[] | undefined, into: boolean = false) {
  if (!evoList) {
    return [];
  }
  const newEvos: Evo[] = [];
  evoList.forEach((curEvo, curIndex) => {
    if (
      HIDDEN_CONDS.includes(curEvo.evolution.condition[0]) ||
      (into &&
        HIDDEN_PRE_CONDS.includes(curEvo.evolution.condition[0]) &&
        !curEvo.seen)
    ) {
      return;
    }
    const beastieEvo = newEvos.find(
      (evo, index) => evo.beastie.id == curEvo.beastie.id && index != curIndex,
    );
    if (beastieEvo) {
      beastieEvo.evolution.condition = [
        ...beastieEvo.evolution.condition,
        ...curEvo.evolution.condition,
      ];
      beastieEvo.evolution.value = [
        ...beastieEvo.evolution.value,
        ...curEvo.evolution.value,
      ];
    } else {
      newEvos.push(curEvo);
    }
  });
  return newEvos;
}

export default function Evolution({
  beastiedata,
}: {
  beastiedata: BeastieType;
}) {
  const { L } = useLocalization();

  const [spoilerMode] = useSpoilerMode();
  const [beastieSeen] = useSpoilerSeen();

  const preEvos = squashEvolutions(
    findBeastiePreevolutions(beastiedata.family, beastiedata.id),
  );
  const evolutions = squashEvolutions(
    beastiedata.evolution?.map((evo) => {
      return {
        beastie: BEASTIE_DATA.get(evo.specie) as BeastieType,
        evolution: structuredClone(evo),
        seen: spoilerMode == SpoilerMode.All || beastieSeen[evo.specie],
      };
    }),
    true,
  );

  const [showEvolution, setShowEvolution] = useState("");

  return (
    <InfoBox header={L("beastiepedia.info.metamorphosis.title")}>
      {preEvos?.length ? (
        preEvos.map((evo, index) => (
          <EvoText
            key={`${evo.beastie.id}${index}`}
            evo={evo}
            into={false}
            isSpoiler={
              evo
                ? spoilerMode == SpoilerMode.OnlySeen &&
                  !beastieSeen[evo.beastie.id]
                : false
            }
          />
        ))
      ) : (
        <div>{L("beastiepedia.info.metamorphosis.fromNone")}</div>
      )}

      {showEvolution == beastiedata.id || spoilerMode == SpoilerMode.All ? (
        evolutions.length ? (
          evolutions.map((evo, index) => (
            <EvoText
              key={evo.beastie.id + index}
              evo={evo}
              into={true}
              isSpoiler={
                spoilerMode == SpoilerMode.OnlySeen &&
                !beastieSeen[evo.beastie.id]
              }
            />
          ))
        ) : (
          <div>{L("beastiepedia.info.metamorphosis.toNone")}</div>
        )
      ) : (
        <div onClick={() => setShowEvolution(beastiedata.id)}>
          {L("beastiepedia.info.metamorphosis.spoiler")}
        </div>
      )}
    </InfoBox>
  );
}
