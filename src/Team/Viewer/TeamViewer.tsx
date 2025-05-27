import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./TeamViewer.module.css";
import { Team } from "../Types.ts";
import Beastie from "../Beastie/Beastie.tsx";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider.tsx";
import MoveModalProvider from "../../shared/MoveModalProvider.tsx";
import Header from "../../shared/Header.tsx";
import OpenGraph from "../../shared/OpenGraph.tsx";
import { useNavigate, useParams } from "react-router-dom";
import type {
  FeaturedCategoryRoot,
  FeaturedTeamType,
} from "./FeaturedCategories.ts";
import TeamImageButton from "../TeamImageButton.tsx";
import FeaturedSection from "./FeaturedSection.tsx";
import useScreenOrientation from "../../utils/useScreenOrientation.ts";
import useLocalization from "../../localization/useLocalization.ts";

declare global {
  interface Window {
    team: Team | null;
  }
}

function useFeaturedCategories() {
  const [featuredCategories, setFeaturedCategories] = useState<
    FeaturedCategoryRoot[]
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
  featuredCategories: FeaturedCategoryRoot[],
): undefined[] | [string, FeaturedTeamType] {
  if (!code) {
    return [undefined, undefined];
  }
  for (const category of featuredCategories) {
    const featuredTeam = (
      category.categories
        ? category.categories.map((cat) => cat.teams).flat()
        : category.teams
    ).find((team) => code == team.team.code);
    if (featuredTeam) {
      return [category.header, featuredTeam];
    }
  }
  return [undefined, undefined];
}

export default function Viewer() {
  const { L } = useLocalization();

  const { code }: { code?: string } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState(false);
  const [isLevelOverwritten, setIsLevelOverwritten] = useState(false);
  const [levelOverwrite, setLevelOverwrite] = useState(50);
  const [maxCoaching, setMaxCoaching] = useState(false);
  const orientation = useScreenOrientation(800);

  const navigate = useNavigate();

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
        if (team?.code != code) {
          setTeam(null);
        }
        console.log(error);
      });
  }, [code, team?.code]);

  // Lazy Load Featured Teams.
  const featuredCategories = useFeaturedCategories();

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

  const submitCode = useCallback(() => {
    if (textInput.current && code != textInput.current.value) {
      navigate(
        `/team/viewer/${textInput.current.value.toUpperCase().replace(/O/g, "0").replace(/#/g, "")}`,
      );
      setError(false);
    }
  }, [code, navigate]);

  return (
    <>
      <OpenGraph
        title={
          selectedFeatured
            ? L("teams.viewer.titleCommunity", {
                team: selectedFeatured.name,
                branding: import.meta.env.VITE_BRANDING,
              })
            : L("common.title", {
                page: L("teams.viewer.title"),
                branding: import.meta.env.VITE_BRANDING,
              })
        }
        description={L("teams.viewer.description")}
        image="gameassets/sprMainmenu/8.png"
        url="team/viewer/"
        noindex={!!code}
      />
      <Header
        title={L("teams.viewer.title")}
        returnButtonTo="/team/"
        returnButtonTitle={L("teams.return", {
          branding: import.meta.env.VITE_BRANDING,
        })}
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
            {L("teams.viewer.codeLabel")}
            <input
              type="text"
              ref={textInput}
              defaultValue={code}
              onKeyUp={(event) => event.key == "Enter" && submitCode()}
            />
          </label>
          <button onClick={submitCode}>{L("teams.viewer.findButton")}</button>
        </div>
        <div className={styles.sectionheader}>
          {team && team.code == code
            ? `${team.code}${selectedFeatured ? ` - ${selectedCategoryName} - ${selectedFeatured.name}` : ""}`
            : error
              ? L("teams.viewer.invalidCode", { code: code ?? "" })
              : code
                ? L("teams.viewer.loadingTeam")
                : L("teams.viewer.noTeam")}
        </div>
        <BeastieRenderProvider>
          <div className={styles.team}>
            <MoveModalProvider>
              {code && team && (team.code == code || !error)
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
              {L("teams.viewer.atLevelLabel")}
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
              {L("teams.viewer.maxCoachingLabel")}
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
              {L("teams.viewer.teamBuilderButton")}
            </button>
            {orientation ? <br /> : " - "}
            <TeamImageButton
              team={team?.team}
              atLevel={isLevelOverwritten ? levelOverwrite : undefined}
              maxCoaching={maxCoaching}
            />
          </div>
        </BeastieRenderProvider>

        {orientation ? (
          <div className={styles.sectionheader}>
            {L("teams.viewer.community.menuHint")}
          </div>
        ) : (
          <FeaturedSection
            featuredCategories={featuredCategories}
            code={team?.code}
            setTeam={setTeam}
          />
        )}
      </div>
    </>
  );
}
