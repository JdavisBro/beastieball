import { Link } from "react-router-dom";
import { FeaturedTeamType } from "./FeaturedCategories";
import styles from "./TeamViewer.module.css";
import BEASTIE_DATA from "../../data/BeastieData";
import { useIsSpoiler } from "../../shared/useSpoiler";

const LONG_NAME_LENGTH = 45;
const DESCRIPTION_MAX = 115;

export default function FeaturedTeam({
  team,
  selected,
}: {
  team: FeaturedTeamType;
  selected: boolean;
}) {
  const longDesc = team.description.length > DESCRIPTION_MAX;

  const [isSpoilerFn, setSeen] = useIsSpoiler();

  const handleClick = () => {
    setSeen(team.team.team.map((beastie) => beastie.specie));
  };

  return (
    <Link
      to={`/team/viewer/${team.team.code}`}
      onClick={handleClick}
      className={selected ? styles.featuredTeamSelected : styles.featuredTeam}
    >
      <div
        style={{
          fontSize: `${Math.min(1, LONG_NAME_LENGTH / team.name.length)}em`,
        }}
      >
        {team.name}
      </div>
      <div className={styles.featuredDesc}>
        <div>
          {team.description.slice(0, DESCRIPTION_MAX).trimEnd()}
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
        {team.team.team.map((teamBeastie, index) => {
          const beastie = BEASTIE_DATA.get(teamBeastie.specie);
          if (!beastie) {
            return null;
          }
          const isSpoiler = isSpoilerFn(beastie.id);
          const alt = `${isSpoiler ? `Beastie #${beastie.number}` : beastie.name} icon`;
          return (
            <img
              key={beastie.id + String(index)}
              src={
                isSpoiler
                  ? "/gameassets/sprExclam_1.png"
                  : `/icons/${beastie.name}.png`
              }
              alt={alt}
              title={alt}
              style={isSpoiler ? { filter: "brightness(50%)" } : undefined}
              className={styles.featuredIcon}
            />
          );
        })}
      </div>
      <div>
        By {team.author}
        {team.builder ? "" : ` - #${team.team.code}`}
      </div>
    </Link>
  );
}
