import styles from "./Beastdle.module.css";
import { BeastieType } from "../data/BeastieData";
import { TYPES } from "./Beastdle";

const UPARROW = <img src="/gameassets/sprBoost/0.png" alt="Up" />;
const DOWNARROW = <img src="/gameassets/sprBoost/3.png" alt="Down" />;

/* prettier-ignore */
const TRAINING_TYPE: Record<string, React.ReactElement> = {
  b: <img src="/gameassets/sprIcon/0.png" alt="Body" />,
  h: <img src="/gameassets/sprIcon/1.png" alt="Spirit" />,
  m: <img src="/gameassets/sprIcon/2.png" alt="Mind" />,
};

export default function BeastieGuess({
  beastie,
  target,
}: {
  beastie: BeastieType | undefined;
  target: BeastieType;
}) {
  if (!beastie) {
    return null;
  }
  const StatComp = ({
    type,
    powdef,
  }: {
    type: (typeof TYPES)[number];
    powdef: "a" | "d";
  }) => {
    const numkey = (type.char + powdef) as
      | "ba"
      | "ha"
      | "ma"
      | "bd"
      | "hd"
      | "md";
    const mine = beastie[numkey];
    const targets = target[numkey];
    return (
      <td
        className={
          mine == targets ? styles.guessSection : styles.guessSectionWrong
        }
        key={type.name}
      >
        {mine == targets ? "" : mine > targets ? DOWNARROW : UPARROW}
        {mine}
      </td>
    );
  };
  const correct = beastie.id == target.id;

  const training = beastie.tyield
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

  const trainingPartMatch = beastie.tyield.some(
    (value, index) =>
      index % 2 == 0 &&
      target.tyield.some((val2, ind2) => ind2 % 2 == 0 && value == val2),
  );
  const trainingFullMatch = beastie.tyield.some(
    (value, index) =>
      index % 2 == 0 &&
      target.tyield.some(
        (val2, ind2) =>
          ind2 % 2 == 0 &&
          value == val2 &&
          beastie.tyield[index + 1] == target.tyield[ind2 + 1],
      ),
  );
  return (
    <tr>
      <td className={correct ? styles.guessSection : styles.guessSectionWrong}>
        <img src={`/icons/${beastie.name}.png`} alt={`${beastie.name} Icon`} />
        {beastie.name}
      </td>
      {TYPES.map((type) => (
        <StatComp type={type} powdef="a" key={type.name} />
      ))}
      {TYPES.map((type) => (
        <StatComp type={type} powdef="d" key={type.name} />
      ))}
      <td
        className={
          Boolean(beastie.evolution) == Boolean(target.evolution)
            ? styles.guessSection
            : styles.guessSectionWrong
        }
      >
        {beastie.evolution ? "Yes" : "No"}
      </td>
      <td
        className={
          beastie.growth == target.growth
            ? styles.guessSection
            : styles.guessSectionWrong
        }
      >
        {beastie.growth == target.growth
          ? ""
          : beastie.growth > target.growth
            ? DOWNARROW
            : UPARROW}
        {(1_000_000 * beastie.growth).toLocaleString()}
      </td>
      <td
        className={
          trainingFullMatch
            ? styles.guessSection
            : trainingPartMatch
              ? styles.guessSectionMaybe
              : styles.guessSectionWrong
        }
      >
        {training}
      </td>
    </tr>
  );
}
