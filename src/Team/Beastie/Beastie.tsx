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
import useLocalization from "../../localization/useLocalization";

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
  const { L, getLink } = useLocalization();

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

  const beastieName = L(beastiedata.name);

  return (
    <div className={styles.beastie}>
      <div className={styles.row}>
        <div className={styles.column}>
          <span className={styles.name}>
            {teamBeastie.name || beastieName}
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
          {teamBeastie.name && beastieName != teamBeastie.name ? (
            <span className={styles.graytext}>({beastieName})</span>
          ) : null}
          <Link
            to={getLink(
              `/beastiepedia/${beastieName}?${searchParam}=${beastieColors.join(",")}`,
            )}
            title={`Open ${beastieName} with these colors in Beastiepedia`}
          >
            <BeastieImage
              key={teamBeastie.pid + teamBeastie.specie}
              defaultUrl={`/icons/${beastieName}.png`}
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
            <span className={styles.graytext}>{L(ability.name)}</span>
            <TextTag>{L(ability.desc).replace(/\|/, "")}</TextTag>
          </div>
        </div>
      </div>
      <div className={styles.moverow}>
        {teamBeastie.attklist.map((moveId, index) => (
          <BeastieMove
            key={moveId + index}
            move={MOVE_DIC[moveId]}
            impossible={!beastiedata.attklist.includes(moveId)}
          />
        ))}
      </div>
    </div>
  );
}
