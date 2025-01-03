import { useEffect, useRef, useState } from "react";

import styles from "./Teams.module.css";
import { Team } from "../Types.ts";
import Beastie from "../Beastie/Beastie.tsx";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider.tsx";
import MoveModalProvider from "../../shared/MoveModalProvider.tsx";
import Header from "../../shared/Header.tsx";
import OpenGraph from "../../shared/OpenGraph.tsx";
import { useNavigate, useParams } from "react-router-dom";
import type {
  FeaturedCategory,
  FeaturedTeamType,
} from "./FeaturedCategories.ts";
import FeaturedTeam from "./FeaturedTeam.tsx";
import TeamImageButton from "../TeamImageButton.tsx";

declare global {
  interface Window {
    team: Team | null;
  }
}

function useFeaturedCategories() {
  const [featuredCategories, setFeaturedCategories] = useState<
    FeaturedCategory[]
  >([]);

  useEffect(() => {
    import("./FeaturedCategories.ts").then((module) =>
      setFeaturedCategories(module.default),
    );
  });

  return featuredCategories;
}

const VALID_CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function findFeatured(
  code: string | undefined,
  featuredCategories: FeaturedCategory[],
): undefined[] | [string, FeaturedTeamType] {
  if (!code) {
    return [undefined, undefined];
  }
  for (const category of featuredCategories) {
    const featuredTeam = category.teams.find((team) => code == team.team.code);
    if (featuredTeam) {
      return [category.header, featuredTeam];
    }
  }
  return [undefined, undefined];
}

export default function Viewer() {
  const { code }: { code?: string } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState(false);
  const [isLevelOverwritten, setIsLevelOverwritten] = useState(false);
  const [levelOverwrite, setLevelOverwrite] = useState(50);
  const [maxCoaching, setMaxCoaching] = useState(false);

  const navigate = useNavigate();
  const setCode = (code: string) => {
    navigate(
      `/team/viewer/${code.toUpperCase().replace(/O/g, "0").replace(/#/g, "")}`,
    );
    setError(false);
  };

  window.team = team;

  const textInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      team?.code == code ||
      !code ||
      // Don't make request on prerender
      window.navigator.userAgent.toLowerCase().includes("prerender")
    ) {
      return;
    }
    if (code.split("").some((char) => !VALID_CHARACTERS.includes(char))) {
      setError(true);
      return;
    }
    fetch(
      `https://api.beastieballgame.com/api/teams/${code.replace(/O/g, "0")}`,
      {
        method: "GET",
      },
    )
      .then((res) => {
        if (res.status == 200) {
          res.json().then((json) => {
            setTeam(json);
            setError(false);
          });
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
  }, [code, team?.code]);

  // Lazy Load Featured Teams.
  const featuredCategories = useFeaturedCategories();
  const [featuredTab, setFeaturedTab] = useState(0);

  const [selectedCategoryName, selectedFeatured] = findFeatured(
    code,
    featuredCategories,
  );
  useEffect(() => {
    if (selectedFeatured) {
      setTeam(selectedFeatured.team);
    }
  }, [selectedFeatured]);

  return (
    <div>
      <OpenGraph
        title={`${selectedFeatured ? `${selectedFeatured.name} - ` : ""}Team Viewer - ${import.meta.env.VITE_BRANDING}`}
        description="Online Team Viewer for SportsNet download codes from Beastieball!"
        image="gameassets/sprMainmenu/8.png"
        url="team/viewer/"
        noindex={!!code}
      />
      <Header
        title="Team Viewer"
        returnButtonTo="/team/"
        returnButtonTitle={`${import.meta.env.VITE_BRANDING} Team Page`}
      />
      <div className={styles.sectionheader}>
        <label>
          Team Code: <input type="text" ref={textInput} defaultValue={code} />
        </label>
        <button
          onClick={() => {
            if (textInput.current && code != textInput.current.value) {
              setCode(textInput.current.value);
              setTeam(null);
            }
          }}
        >
          Find
        </button>
      </div>
      <div className={styles.sectionheader}>
        {error && !selectedFeatured ? `Invalid Code: ${code}` : null}
      </div>
      <div className={styles.sectionheader}>
        {team
          ? `${team.code}${selectedFeatured ? ` - ${selectedCategoryName} - ${selectedFeatured.name}` : ""}`
          : ""}
      </div>
      <BeastieRenderProvider>
        <div className={styles.team}>
          <MoveModalProvider>
            {team
              ? team.team.map((beastie) => (
                  <Beastie
                    key={beastie.pid}
                    teamBeastie={beastie}
                    levelOverwrite={
                      isLevelOverwritten ? levelOverwrite : undefined
                    }
                    maxCoaching={maxCoaching}
                  />
                ))
              : null}
          </MoveModalProvider>
        </div>
        <div className={styles.sectionheader}>
          <label>
            <input
              type="checkbox"
              onChange={(event) =>
                setIsLevelOverwritten(event.currentTarget.checked)
              }
            />
            At Level{" "}
            <input
              type="number"
              onChange={(event) =>
                setLevelOverwrite(Number(event.currentTarget.value))
              }
              min={1}
              max={100}
              defaultValue={50}
            />
          </label>
          {" - "}
          <label>
            <input
              type="checkbox"
              onChange={(event) => setMaxCoaching(event.currentTarget.checked)}
            />
            Max Coaching
          </label>
          {" - "}
          <button
            onClick={() => {
              if (team) {
                localStorage.setItem(
                  "teamBuilderTeam",
                  JSON.stringify(team.team),
                );
                navigate("/team/builder/");
              }
            }}
            disabled={!team}
          >
            Open in Team Builder
          </button>
          {" - "}
          <TeamImageButton
            team={team?.team}
            atLevel={isLevelOverwritten ? levelOverwrite : undefined}
            maxCoaching={maxCoaching}
          />
        </div>
      </BeastieRenderProvider>
      <br />
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
            selected={team?.code == featuredteam.team.code}
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
    </div>
  );
}

const FEATURED_TEAM_ISSUE_TEXT = `Name: Insert Team Name Here
Description: Insert Team Description Here
Code: Insert Team Code Here (shared from in game)
Author: Insert Author Name Here (how you'd like to be credited)`.replace(
  /\n/g,
  "%0A",
);
