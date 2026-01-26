import { useState } from "react";
import useLocalization from "../../localization/useLocalization";
import Modal from "../../shared/Modal";
import { BuilderTeam, TeamBeastie } from "../Types";
import { decodeTeam, encodeTeam } from "./encodeTeam";
import styles from "./TeamBuilder.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import BEASTIE_DATA from "../../data/BeastieData";

export default function TeamShareCode({
  team,
  setTeam,
}: {
  team: TeamBeastie[];
  setTeam: (team: BuilderTeam) => void;
}) {
  const { L } = useLocalization();

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const code = params.get("code");

  const [loadCode, setLoadCode] = useState(code);

  let load_team: null | TeamBeastie[] = null;
  if (loadCode) {
    try {
      load_team = decodeTeam(loadCode, L);
    } catch {}
  }

  const [open, setOpen] = useState(!!load_team);

  const teamCode = open ? encodeTeam(team) : "";

  return (
    <>
      <button onClick={() => setOpen(true)}>
        {L("teams.builder.shareCode.title")}
      </button>
      <Modal
        header={L("teams.builder.shareCode.title")}
        open={open}
        hashValue={"ShareCode"}
        onClose={() => setOpen(false)}
        makeOpen={() => setOpen(true)}
      >
        <div className={styles.shareModal}>
          <div>{L("teams.builder.shareCode.note")}</div>
          <label>
            {L("teams.builder.shareCode.current")}
            <input type="text" value={teamCode} readOnly={true} />
            <button
              onClick={() => navigator.clipboard.writeText(teamCode)}
              disabled={!team.length}
            >
              {L("teams.builder.shareCode.copy")}
            </button>
            <button
              onClick={() => {
                const url = new URL(window.location.href);
                url.hash = "";
                url.searchParams.set("code", teamCode);
                navigator.clipboard.writeText(url.toString());
              }}
              disabled={!team.length}
            >
              {L("teams.builder.shareCode.copyLink")}
            </button>
          </label>
          <label>
            {L("teams.builder.shareCode.loadLabel")}
            <input
              type="text"
              value={loadCode ?? ""}
              onChange={(event) => setLoadCode(event.target.value)}
            />
          </label>
          {load_team ? (
            <>
              <div>{L("teams.builder.shareCode.loading")}</div>
              <div className={styles.savedTeamBeasties}>
                {load_team.map((beastie) => (
                  <img
                    src={`/icons/${L(BEASTIE_DATA.get(beastie.specie)?.name ?? "beastiesetup_name_001", undefined, true)}.png`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setTeam(load_team);
                  setOpen(false);
                  setLoadCode(null);
                  navigate({ search: "" });
                }}
              >
                {L("teams.builder.shareCode.loadButton")}
              </button>
            </>
          ) : loadCode ? (
            L("teams.builder.shareCode.invalid")
          ) : null}
        </div>
      </Modal>
    </>
  );
}
