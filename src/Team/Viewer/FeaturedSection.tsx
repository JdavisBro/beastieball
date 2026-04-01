import { useState } from "react";
import { FeaturedCategoryRoot } from "./FeaturedCategories";
import FeaturedTeam from "./FeaturedTeam";
import styles from "./TeamViewer.module.css";
import BeastieSelect from "../../shared/BeastieSelect";
import useLocalization from "../../localization/useLocalization";
import InfoTabberHeader from "../../shared/InfoTabber";

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
  const { L } = useLocalization();

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
    return (
      <div className={styles.categorybg}>
        {L("teams.viewer.loadingCommunity")}
      </div>
    );
  }

  const selectedCategory = selectedTab
    ? selectedTab.categories
      ? selectedTab.categories[subTab]
      : selectedTab
    : undefined;
  const teams = allSelected
    ? featuredCategories.flatMap((root) =>
        root.teams
          ? root.teams.map((team) => ({ team, category: root }))
          : root.categories.flatMap((category) =>
              category.teams.map((team) => ({ team, category })),
            ),
      )
    : (selectedCategory?.teams.map((team) => ({
        team,
        category: selectedCategory,
      })) ?? []);

  return (
    <>
      <InfoTabberHeader
        tab={tab}
        setTab={setTab}
        tabs={[
          ...featuredCategories.map((category) => category.header),
          L("teams.viewer.community.all"),
        ]}
        className={styles.categorybg}
      />
      {!allSelected && selectedTab.categories ? (
        <InfoTabberHeader
          tab={subTab}
          setTab={setSubTab}
          tabs={selectedTab.categories.map((category) => category.header)}
          className={styles.categorybg}
        />
      ) : null}
      {selectedTab?.description ? (
        <div className={styles.sectionheader}>{selectedTab.description}</div>
      ) : undefined}
      <div className={styles.sectionheader}>
        <label>
          {L("teams.viewer.community.filter.label")}
          <select
            onChange={(event) => setFilterType(Number(event.target.value))}
          >
            <option value={FilterType.Name}>
              {L("teams.viewer.community.filter.name")}
            </option>
            <option value={FilterType.Author}>
              {L("teams.viewer.community.filter.author")}
            </option>
            <option value={FilterType.Beastie}>
              {L("teams.viewer.community.filter.beastie")}
            </option>
          </select>
        </label>
        {filterType == FilterType.Beastie ? (
          <BeastieSelect
            beastieId={filterBeastie}
            setBeastieId={setFilterBeastie}
            hashName="FilterTeams"
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
          .filter(({ team }) =>
            filterType == FilterType.Beastie
              ? team.team.team.some(
                  (teamBeastie) =>
                    !filterBeastie || teamBeastie.specie == filterBeastie,
                )
              : (filterType == FilterType.Author ? team.author : team.name)
                  .toLowerCase()
                  .includes(filterText.toLowerCase()),
          )
          .map(({ team, category }) => (
            <FeaturedTeam
              key={team.team.code + category.header}
              team={team}
              selected={code == team.team.code}
            />
          ))}
      </div>
      <div className={styles.addTeamText}>
        {L("teams.viewer.community.add")}
        <a
          target="_blank"
          rel="noreferrer"
          href={
            import.meta.env.VITE_ISSUES_URL +
            `new?title=New Featured Team&body=${L(
              "teams.viewer.community.issueDefaultText",
            ).replace(/\n/g, "%0A")}`
          }
        >
          {L("teams.viewer.community.addLink")}
        </a>
      </div>
    </>
  );
}
