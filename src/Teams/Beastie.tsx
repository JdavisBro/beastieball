import styles from "./Teams.module.css";
import BEASTIE_DATA from "../data/BeastieData";
import { BeastieImage } from "../shared/beastieRender/BeastieImage";
import { TeamBeastie } from "./Types";
import StatDistribution from "./StatDistribution";
import TextTag from "../shared/TextTag";
import abilities from "../data/abilities";
import MOVE_DIC from "../data/MoveData";
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

export default function Beastie({ teamBeastie }: { teamBeastie: TeamBeastie }) {
  const beastiedata = BEASTIE_DATA.get(teamBeastie.specie);
  if (!beastiedata) {
    return null;
  }

  const searchParam = altSearchMap[Math.ceil(teamBeastie.color[0])];

  const beastieColors = teamBeastie.color.map(
    (value) => value - Math.ceil(value) + 1,
  );

  const level = Math.min(
    100,
    Math.floor(Math.cbrt(Math.ceil(teamBeastie.xp / beastiedata.growth))),
  );

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
            <span className={styles.number}>
              #{teamBeastie.number}
            </span> Lvl {Math.floor(Math.cbrt(teamBeastie.xp))}
          </span>
          <Link
            to={`/beastiepedia/${beastiedata.name}?${searchParam}=${beastieColors.join(",")}`}
            target="_blank"
            title={`Open ${beastiedata.name} with these colors in Beastiepedia`}
          >
            <BeastieImage
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
          />
          <span className={styles.ability}>{ability.name}</span>
          <TextTag>{ability.desc}</TextTag>
        </div>
      </div>
      <div className={styles.moverow}>
        {teamBeastie.attklist.map((moveId) => (
          <BeastieMove key={moveId} move={MOVE_DIC[moveId]} />
        ))}
      </div>
    </div>
  );
}
