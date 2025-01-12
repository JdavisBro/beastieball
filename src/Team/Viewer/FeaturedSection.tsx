import { Team } from "../Types";
import { FeaturedCategory } from "./FeaturedCategories";
import FeaturedTeam from "./FeaturedTeam";
import styles from "./TeamViewer.module.css";

export default function FeaturedSection({
  featuredCategories,
  featuredTab,
  setFeaturedTab,
  code,
  setTeam,
}: {
  featuredCategories: FeaturedCategory[];
  featuredTab: number;
  setFeaturedTab: (tab: number) => void;
  code?: string;
  setTeam: (team: Team) => void;
}) {
  return (
    <>
      <div className={styles.categorybg}>
        {featuredCategories?.map((category, index) => (
          <button
            key={category.header}
            className={
              index == featuredTab
                ? styles.categorybuttonSelected
                : styles.categorybutton
            }
            onClick={() => setFeaturedTab(index)}
          >
            {category.header}
          </button>
        ))}
      </div>
      <div className={styles.sectionheader}>
        {featuredCategories[featuredTab]?.description ?? ""}
      </div>
      <div className={styles.featuredList}>
        {featuredCategories[featuredTab]?.teams.map((featuredteam) => (
          <FeaturedTeam
            key={featuredteam.name}
            team={featuredteam}
            selected={code == featuredteam.team.code}
            setTeam={() => {
              if (code != featuredteam.team.code) {
                setTeam(featuredteam.team);
              }
            }}
          />
        ))}
      </div>
      <div className={styles.addTeamText}>
        Want your team added?{" "}
        <a
          target={"_blank"}
          rel="noreferrer"
          href={
            import.meta.env.VITE_ISSUES_URL +
            `new?title=New Featured Team&body=${FEATURED_TEAM_ISSUE_TEXT}`
          }
        >
          Make an issue on GitHub
        </a>
      </div>
    </>
  );
}

const FEATURED_TEAM_ISSUE_TEXT = `Name: Insert Team Name Here
Description: Insert Team Description Here
Code: Insert Team Code Here (shared from in game)
Author: Insert Author Name Here (how you'd like to be credited)`.replace(
  /\n/g,
  "%0A",
);
