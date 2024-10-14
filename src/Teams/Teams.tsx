import { useEffect, useRef, useState } from "react";

import styles from "./Teams.module.css";
import { Team } from "./Types";
import Beastie from "./Beastie";
import BeastieRenderProvider from "../shared/beastieRender/BeastieRenderProvider";
import MoveModalProvider from "../shared/MoveModalProvider";
import Header from "../shared/Header";
import OpenGraph from "../shared/OpenGraph";
import { useNavigate, useParams } from "react-router-dom";
import featuredTeams from "./FeaturedTeams";
import FeaturedTeam from "./FeaturedTeam";

declare global {
  interface Window {
    team: Team | null;
  }
}

const VALID_CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function Teams() {
  const { code }: { code?: string } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState(false);
  const [isLevelOverwritten, setIsLevelOverwritten] = useState(false);
  const [levelOverwrite, setLevelOverwrite] = useState(50);

  const navigate = useNavigate();
  const setCode = (code: string) => {
    navigate(`/teams/${code.toUpperCase().replace(/#/g, "")}`);
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
    fetch(`https://api.beastieballgame.com/api/teams/${code}`, {
      method: "GET",
    })
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

  const selectedFeatured = featuredTeams.find((team) => team.code == team.code);

  return (
    <div>
      <OpenGraph
        title={`Teams - ${import.meta.env.VITE_BRANDING}`}
        description="Online Team Viewer for Beastieball"
        image="gameassets/sprMainmenu/20.png"
        url="teams/"
      />
      <Header title="Teams" />
      <div className={styles.sectionheader}>
        <label>
          Team Code: <input type="text" ref={textInput} defaultValue={code} />
        </label>
        <button
          onClick={() => textInput.current && setCode(textInput.current.value)}
        >
          Find
        </button>
      </div>
      <div className={styles.sectionheader}>
        {error ? `Invalid Code: ${code}` : null}
      </div>
      <div className={styles.sectionheader}>
        {team
          ? `${team.code}${selectedFeatured ? ` - ${selectedFeatured.name}` : ""}`
          : ""}
      </div>
      <div className={styles.team}>
        <MoveModalProvider>
          <BeastieRenderProvider>
            {team
              ? team.team.map((beastie) => (
                  <Beastie
                    key={beastie.pid}
                    teamBeastie={beastie}
                    levelOverwrite={
                      isLevelOverwritten ? levelOverwrite : undefined
                    }
                  />
                ))
              : null}
          </BeastieRenderProvider>
        </MoveModalProvider>
      </div>
      <div className={styles.sectionheader}>
        <label>
          <input
            type="checkbox"
            onChange={(event) => setIsLevelOverwritten(event.target.checked)}
          />
          At Level{" "}
          <input
            type="number"
            onChange={(event) => setLevelOverwrite(Number(event.target.value))}
            min={1}
            max={100}
            defaultValue={50}
          />
        </label>
      </div>
      <div className={styles.sectionheader}>Featured Teams</div>
      <div className={styles.team}>
        {featuredTeams.map((team) => (
          <FeaturedTeam key={team.name} team={team} />
        ))}
      </div>
    </div>
  );
}
