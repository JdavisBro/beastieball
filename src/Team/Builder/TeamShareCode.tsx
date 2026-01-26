import { useRef, useState } from "react";
import useLocalization from "../../localization/useLocalization";
import Modal from "../../shared/Modal";
import { BuilderTeam, TeamBeastie } from "../Types";
import { decodeTeam, encodeTeam } from "./encodeTeam";
import styles from "./TeamBuilder.module.css";

export default function TeamShareCode({
  team,
  setTeam,
}: {
  team: TeamBeastie[];
  setTeam: (team: BuilderTeam) => void;
}) {
  const { L } = useLocalization();

  const [open, setOpen] = useState(false);

  const [loadFailed, setLoadFailed] = useState(false);

  const loadRef = useRef<HTMLInputElement>(null);

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
            <input type="text" ref={loadRef} />
            <button
              onClick={() => {
                if (loadRef.current) {
                  try {
                    setTeam(decodeTeam(loadRef.current.value, L));
                    setLoadFailed(false);
                  } catch {
                    setLoadFailed(true);
                  }
                }
              }}
            >
              {L("teams.builder.shareCode.loadButton")}
            </button>
          </label>
          {loadFailed ? <div>{L("teams.builder.shareCode.failed")}</div> : null}
        </div>
      </Modal>
    </>
  );
}
