import { Link } from "react-router-dom";
import { FeaturedTeamType } from "./FeaturedTeams";
import styles from "./Teams.module.css";
import BEASTIE_DATA from "../data/BeastieData";

const DESCRIPTION_MAX = 90;

export default function FeaturedTeam({
  team,
  selected,
  setTeam,
}: {
  team: FeaturedTeamType;
  selected: boolean;
  setTeam: () => void;
}) {
  const longDesc = team.description.length > DESCRIPTION_MAX;

  return (
    <Link
      to={`/teams/${team.team.code}`}
      onClick={setTeam}
      className={selected ? styles.featuredTeamSelected : styles.featuredTeam}
    >
      <div>{team.name}</div>
      <div className={styles.featuredDesc}>
        <div>
          {team.description.slice(0, DESCRIPTION_MAX)}
          {longDesc ? "..." : ""}
        </div>
        {longDesc ? (
          <div
            className={styles.featuredHover}
            onClick={(event) => {
              if (longDesc) {
                event.stopPropagation();
                event.preventDefault();
              }
            }}
          >
            <div className={styles.featuredHoverCollapsed}>
              V Hover / Tap to Expand V
            </div>
            <div className={styles.featuredHoverDesc}>{team.description}</div>
          </div>
        ) : null}
      </div>
      <div className={styles.featuredIcons}>
        {team.team.team.map((beastie, index) => {
          const beastieName = BEASTIE_DATA.get(beastie.specie)?.name;
          return (
            <img
              key={beastieName + String(index)}
              src={`/icons/${beastieName}.png`}
              alt={`${beastieName} icon`}
              className={styles.featuredIcon}
            />
          );
        })}
      </div>
      <div>
        By {team.author} - #{team.team.code}
      </div>
    </Link>
  );
}
