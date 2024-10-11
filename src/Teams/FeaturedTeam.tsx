import { Link } from "react-router-dom";
import { FeaturedTeamType } from "./FeaturedTeams";
import styles from "./Teams.module.css";

export default function FeaturedTeam({ team }: { team: FeaturedTeamType }) {
  return (
    <Link to={`/teams/${team.code}`} className={styles.featuredTeam}>
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
      <div>{team.code}</div>
    </Link>
  );
}
