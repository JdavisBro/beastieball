import { useState } from "react";
import { Team } from "../Types";
import { FeaturedCategoryRoot } from "./FeaturedCategories";
import FeaturedTeam from "./FeaturedTeam";
import styles from "./TeamViewer.module.css";

export default function FeaturedSection({
  featuredCategories,
  code,
  setTeam,
}: {
  featuredCategories: FeaturedCategoryRoot[];
  code?: string;
  setTeam: (team: Team) => void;
}) {
  const [tab, setTab] = useState(0);
  const [subTab, setSubTab] = useState(0);

  const selectedTab = featuredCategories[tab];

  if (!selectedTab) {
    return <div className={styles.categorybg}>Loading Community Teams...</div>;
  }

  return (
    <>
      <div className={styles.categorybg}>
        {featuredCategories?.map((category, index) => (
          <button
            key={category.header}
            className={
              index == tab
                ? styles.categorybuttonSelected
                : styles.categorybutton
            }
            onClick={() => {
              setTab(index);
              setSubTab(0);
            }}
          >
            {category.header}
          </button>
        ))}
      </div>
      <div className={styles.sectionheader}>
        {featuredCategories[tab]?.description ?? ""}
      </div>
      {selectedTab.categories ? (
        <div className={styles.categorybg}>
          {selectedTab.categories.map((category, index) => (
            <button
              key={category.header}
              className={
                index == subTab
                  ? styles.categorybuttonSelected
                  : styles.categorybutton
              }
              onClick={() => setSubTab(index)}
            >
              {category.header}
            </button>
          ))}
        </div>
      ) : null}
      <div className={styles.featuredList}>
        {(selectedTab.categories
          ? selectedTab.categories[subTab]
          : selectedTab
        )?.teams.map((featuredteam) => (
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
