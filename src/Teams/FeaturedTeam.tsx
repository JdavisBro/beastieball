import { Link } from "react-router-dom";
import { FeaturedTeamType } from "./FeaturedTeams";
import styles from "./Teams.module.css";

export default function FeaturedTeam({
  team,
  clearTeam,
}: {
  team: FeaturedTeamType;
  clearTeam: () => void;
}) {
  return (
    <Link
      to={`/teams/${team.code}`}
      onClick={clearTeam}
      className={styles.featuredTeam}
    >
      <div>{team.name}</div>
      <div className={styles.graytext}>{team.description}</div>
      <div className={styles.row}>
        {team.beasties.map((beastie, index) => (
          <img
            key={beastie + String(index)}
            src={`/icons/${beastie}.png`}
            alt={`${beastie} icon`}
            className={styles.featuredIcon}
          />
        ))}
      </div>
      <div>
        By {team.author} - #{team.code}
      </div>
    </Link>
  );
}
