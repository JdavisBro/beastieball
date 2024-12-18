import styles from "./Beastie.module.css";
import BEASTIE_DATA from "../../data/BeastieData";
import { BeastieImage } from "../../shared/beastieRender/BeastieImage";
import { TeamBeastie } from "../Types";
import StatDistribution from "./StatDistribution";
import TextTag from "../../shared/TextTag";
import abilities from "../../data/abilities";
import MOVE_DIC from "../../data/MoveData";
import BeastieMove from "./BeastieMove";
import { Link } from "react-router-dom";

const altMap: { [key: number]: "colors" | "shiny" | "colors2" } = {
  1: "colors",
  2: "shiny",
  3: "colors2",
};

const altSearchMap: { [key: number]: string } = {
  1: "color",
  2: "raremorph",
  3: "alt",
};

export default function Beastie({
  teamBeastie,
  levelOverwrite,
  maxCoaching,
}: {
  teamBeastie: TeamBeastie;
  levelOverwrite?: number;
  maxCoaching?: boolean;
}) {
  const beastiedata = BEASTIE_DATA.get(teamBeastie.specie);
  if (!beastiedata) {
    return null;
  }

  const searchParam = altSearchMap[Math.ceil(teamBeastie.color[0])];

  const beastieColors = teamBeastie.color.map(
    (value) => value - Math.ceil(value) + 1,
  );

  const level =
    levelOverwrite ??
    Math.min(
      100,
      Math.floor(Math.cbrt(Math.ceil(teamBeastie.xp / beastiedata.growth))),
    );
  const level_exp = Math.floor(level ** 3 * beastiedata.growth);
  const next_level_exp = Math.floor((level + 1) ** 3 * beastiedata.growth);

  const ability =
    abilities[
      beastiedata.ability[
        teamBeastie.ability_index % beastiedata.ability.length
      ]
    ];

  return (
    <div className={styles.beastie}>
      <div className={styles.row}>
        <div className={styles.column}>
          <span>
            {teamBeastie.name}
            <span className={styles.number}>#{teamBeastie.number}</span>{" "}
            <span
              title={
                levelOverwrite
                  ? ""
                  : level >= 100
                    ? "Max Level"
                    : `To next level: ${teamBeastie.xp - level_exp}/${next_level_exp - level_exp} (${next_level_exp - teamBeastie.xp} left)`
              }
              className={levelOverwrite ? styles.levelOverwritten : undefined}
            >
              Lvl {level}
            </span>
          </span>
          {beastiedata.name != teamBeastie.name ? (
            <span className={styles.graytext}>({beastiedata.name})</span>
          ) : null}
          <Link
            to={`/beastiepedia/${beastiedata.name}?${searchParam}=${beastieColors.join(",")}`}
            title={`Open ${beastiedata.name} with these colors in Beastiepedia`}
          >
            <BeastieImage
              key={teamBeastie.pid + teamBeastie.specie}
              defaultUrl={`/icons/${beastiedata.name}.png`}
              beastie={{
                id: beastiedata.id,
                colors: beastieColors,
                colorAlt: altMap[Math.ceil(teamBeastie.color[0])],
                sprAlt: teamBeastie.spr_index,
              }}
              className={styles.beastieImg}
            />
          </Link>
        </div>
        <div className={styles.column}>
          <StatDistribution
            teamBeastie={teamBeastie}
            beastiedata={beastiedata}
            level={level}
            maxCoaching={maxCoaching}
          />
          <div className={styles.column}>
            <span className={styles.graytext}>{ability.name}</span>
            <TextTag>{ability.desc.replace(/\|/, "")}</TextTag>
          </div>
        </div>
      </div>
      <div className={styles.moverow}>
        {teamBeastie.attklist.map((moveId, index) => (
          <BeastieMove key={moveId + index} move={MOVE_DIC[moveId]} />
        ))}
      </div>
    </div>
  );
}
