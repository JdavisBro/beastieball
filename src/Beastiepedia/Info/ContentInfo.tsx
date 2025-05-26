import StatDistribution from "./StatDistribution";
import TextTag from "../../shared/TextTag";
import styles from "./ContentInfo.module.css";
import type { BeastieType } from "../../data/BeastieData";
import MoveList from "./MoveList";
import designers from "../../data/raw/designers.json";
import abilities from "../../data/abilities";
import InfoBox, { BoxHeader } from "../../shared/InfoBox";
import ResearchCarousel from "./ResearchCarousel";
import ComboMove from "./ComboMove";
import { useState } from "react";
import Sfx from "./Sfx";
import Evolution from "./Evolution";
import useLocalization from "../../localization/useLocalization";

type Props = {
  beastiedata: BeastieType;
};

const NUMBER_FORMAT = Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

function ExpForLevel({ growth }: { growth: number }) {
  const { L } = useLocalization();

  const [userLevel, setUserLevel] = useState(100);
  const level = Math.min(Math.max(userLevel, 0), 100);
  return (
    <InfoBox
      header={
        <>
          {L("beastiepedia.info.expForLevel")}
          <input
            type="number"
            className={styles.levelInput}
            min={0}
            max={100}
            onChange={(event) =>
              setUserLevel(Number(event.currentTarget.value))
            }
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

const TYPES: Record<string, [string, string]> = {
  b: ["/gameassets/sprIcon/0.png", "common.type.body"],
  h: ["/gameassets/sprIcon/1.png", "common.type.spirit"],
  m: ["/gameassets/sprIcon/2.png", "common.type.mind"],
};

export default function ContentInfo(props: Props): React.ReactNode {
  const { L } = useLocalization();
  const beastiedata = props.beastiedata;

  const training = beastiedata.tyield
    .map((type, index, array) => {
      if (index % 2 != 0) return null;
      const [src, altKey] = TYPES[(type as string)[0]];
      return (
        <span key={index} className={styles.training}>
          {index != 0 ? <br /> : null}
          <span>
            {L("beastiepedia.info.allyTrainingPlus", {
              num: String(array[index + 1]),
            })}
          </span>
          <img src={src} alt={L(altKey)} className={styles.trainingImage} />
          <span>
            {(type as string)[1] == "a" ? L("common.pow") : L("common.def")}
          </span>
        </span>
      );
    })
    .filter((value) => !!value);

  return (
    <div className={styles.info}>
      <div className={styles.wrapinfoboxes}>
        <InfoBox header={L("beastiepedia.info.number")}>
          #{beastiedata.number}
        </InfoBox>
        <InfoBox header={L("beastiepedia.info.name")}>
          {L(beastiedata.name)}
        </InfoBox>
        <InfoBox header={L("beastiepedia.info.development")}>
          {beastiedata.anim_progress}%
        </InfoBox>
        <Evolution beastiedata={beastiedata} />
      </div>
      <InfoBox header={L("beastiepedia.info.description")}>
        {L(beastiedata.desc)}
      </InfoBox>
      <InfoBox header={L("beastiepedia.info.traits.title")}>
        <table className={styles.traittable}>
          <tbody>
            {beastiedata.ability.map((value, index) =>
              value in abilities ? (
                <tr key={value}>
                  <td>
                    {L(abilities[value].name)}
                    {beastiedata.ability_hidden && index > 0
                      ? L("beastiepedia.info.traits.recessive")
                      : ""}
                  </td>
                  <td>
                    <TextTag>
                      {L(abilities[value].desc).replace(/|/g, "")}
                    </TextTag>
                  </td>
                </tr>
              ) : (
                L("beastiepedia.info.traits.error", { value: value })
              ),
            )}
          </tbody>
        </table>
      </InfoBox>
      <BoxHeader>{L("beastiepedia.info.statDistribution")}</BoxHeader>
      <StatDistribution beastiedata={beastiedata} />
      <div className={styles.wrapinfoboxes}>
        <InfoBox header={L("beastiepedia.info.recruit.title")}>
          {beastiedata.recruit_value != 0.5 ? (
            <>
              <TextTag>{L(beastiedata.recruit.description)}</TextTag>
              <br />
              <span className={styles.training}>
                <img
                  src="/gameassets/sprSponsors/1.png"
                  alt={L("beastiepedia.info.recruit.sponsor")}
                  className={styles.gymLogo}
                />
                <span>{NUMBER_FORMAT.format(beastiedata.recruit_value)}</span>
              </span>
            </>
          ) : (
            L("beastiepedia.info.recruit.noRecruit")
          )}
        </InfoBox>
        <InfoBox header={L("beastiepedia.info.allyTraining")}>
          {training}
        </InfoBox>
        <ExpForLevel growth={beastiedata.growth} />
      </div>
      <MoveList
        movelist={beastiedata.attklist}
        learnset={beastiedata.learnset as [number, string][]}
      />
      <ComboMove beastiedata={beastiedata} />
      <InfoBox header={L("beastiepedia.info.research.title")}>
        <div className={styles.research}>
          <ResearchCarousel beastieid={beastiedata.id} />
        </div>
        {L(
          Array.isArray(beastiedata.designer) && beastiedata.designer.length > 1
            ? "beastiepedia.info.research.researchers"
            : "beastiepedia.info.research.researcher",
        )}
        {Array.isArray(beastiedata.designer)
          ? beastiedata.designer
              .map((i) => designers[i])
              .join(L("beastiepedia.info.research.joiner"))
          : designers[beastiedata.designer]}
        <br />
        {L(
          Array.isArray(beastiedata.animator) && beastiedata.animator.length > 1
            ? "beastiepedia.info.research.videographers"
            : "beastiepedia.info.research.videographer",
        )}
        {Array.isArray(beastiedata.animator)
          ? beastiedata.animator.map((i) => designers[i]).join(", ")
          : designers[beastiedata.animator]}
      </InfoBox>
      <Sfx beastiedata={beastiedata} />
    </div>
  );
}
