import { useState } from "react";
import { FeaturedCategoryRoot } from "./FeaturedCategories";
import FeaturedTeam from "./FeaturedTeam";
import styles from "./TeamViewer.module.css";
import BeastieSelect from "../../shared/BeastieSelect";

enum FilterType {
  Name,
  Author,
  Beastie,
}

export default function FeaturedSection({
  featuredCategories,
  code,
}: {
  featuredCategories: FeaturedCategoryRoot[];
  code?: string;
}) {
  const [tab, setTab] = useState(0);
  const [subTab, setSubTab] = useState(0);

  const selectedTab = featuredCategories[tab];
  const allSelected = tab == featuredCategories.length;

  const [filterType, setFilterType] = useState(FilterType.Name);
  const [filterText, setFilterText] = useState("");
  const [filterBeastie, setFilterBeastie] = useState<string | undefined>(
    undefined,
  );

  if (!selectedTab && !allSelected) {
    return <div className={styles.categorybg}>Loading Community Teams...</div>;
  }

  const teams = allSelected
    ? featuredCategories.flatMap((root) =>
        root.teams
          ? root.teams
          : root.categories.flatMap((category) => category.teams),
      )
    : (selectedTab.categories ? selectedTab.categories[subTab] : selectedTab)
        ?.teams;

  return (
    <>
      <div className={styles.categorybg}>
        {featuredCategories.map((category, index) => (
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
        <button
          className={
            allSelected ? styles.categorybuttonSelected : styles.categorybutton
          }
          onClick={() => {
            setTab(featuredCategories.length);
            setSubTab(0);
          }}
        >
          All Teams
        </button>
      </div>
      {!allSelected && selectedTab.categories ? (
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
      {selectedTab?.description ? (
        <div className={styles.sectionheader}>{selectedTab.description}</div>
      ) : undefined}
      <div className={styles.sectionheader}>
        <label>
          Filter:{" "}
          <select
            onChange={(event) => setFilterType(Number(event.target.value))}
          >
            <option value={FilterType.Name}>Name</option>
            <option value={FilterType.Author}>Author</option>
            <option value={FilterType.Beastie}>Beastie</option>
          </select>
        </label>
        {filterType == FilterType.Beastie ? (
          <BeastieSelect
            beastieId={filterBeastie}
            setBeastieId={setFilterBeastie}
          />
        ) : (
          <input
            type="search"
            onChange={(event) => setFilterText(event.target.value)}
            value={filterText}
            onFocus={(event) => event.currentTarget.select()}
          />
        )}
      </div>
      <div className={styles.featuredList}>
        {teams
          .filter((featuredTeam) =>
            filterType == FilterType.Beastie
              ? featuredTeam.team.team.some(
                  (teamBeastie) =>
                    !filterBeastie || teamBeastie.specie == filterBeastie,
                )
              : (filterType == FilterType.Author
                  ? featuredTeam.author
                  : featuredTeam.name
                )
                  .toLowerCase()
                  .includes(filterText.toLowerCase()),
          )
          .map((featuredteam) => (
            <FeaturedTeam
              key={featuredteam.team.code}
              team={featuredteam}
              selected={code == featuredteam.team.code}
            />
          )) || "no teams 🥺"}
      </div>
      <div className={styles.addTeamText}>
        Want your team added?{" "}
        <a
          target="_blank"
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
