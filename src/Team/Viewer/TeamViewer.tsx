import { useEffect, useRef, useState } from "react";

import styles from "./TeamViewer.module.css";
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
import TeamImageButton from "../TeamImageButton.tsx";
import FeaturedSection from "./FeaturedSection.tsx";
import useScreenOrientation from "../../utils/useScreenOrientation.ts";

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
  const orientation = useScreenOrientation();

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

  const [mobileFeatured, setMobileFeatured] = useState(false);

  return (
    <>
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
        menuButton={orientation}
        menuButtonState={mobileFeatured}
        onMenuButtonPressed={() => setMobileFeatured(!mobileFeatured)}
      />
      {orientation ? (
        <div
          className={
            mobileFeatured ? styles.mobileFeatured : styles.mobileFeaturedHidden
          }
        >
          <FeaturedSection
            featuredCategories={featuredCategories}
            featuredTab={featuredTab}
            setFeaturedTab={setFeaturedTab}
            code={team?.code}
            setTeam={(team) => {
              setMobileFeatured(false);
              setTeam(team);
            }}
          />
        </div>
      ) : null}
      <div
        className={
          orientation && mobileFeatured ? styles.pageHidden : undefined
        }
      >
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
            {orientation ? <br /> : " - "}
            <label>
              <input
                type="checkbox"
                onChange={(event) =>
                  setMaxCoaching(event.currentTarget.checked)
                }
              />
              Max Coaching
            </label>
            {orientation ? <br /> : " - "}
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
            {orientation ? <br /> : " - "}
            <TeamImageButton
              team={team?.team}
              atLevel={isLevelOverwritten ? levelOverwrite : undefined}
              maxCoaching={maxCoaching}
            />
          </div>
        </BeastieRenderProvider>
        <div className={styles.sectionheader}>
          {orientation ? (
            "View Community Teams by toggling the menu in the top left."
          ) : (
            <FeaturedSection
              featuredCategories={featuredCategories}
              featuredTab={featuredTab}
              setFeaturedTab={setFeaturedTab}
              code={team?.code}
              setTeam={setTeam}
            />
          )}
        </div>
      </div>
    </>
  );
}
