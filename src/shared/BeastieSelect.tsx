import { useCallback, useState } from "react";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { SpoilerMode, useSpoilerMode, useSpoilerSeen } from "./useSpoiler";

const BEASTIES = [...BEASTIE_DATA.values()];

function BeastieButton({
  beastie,
  isSpoiler,
  visible,
  handleClick,
}: {
  beastie: BeastieType;
  isSpoiler: boolean;
  visible: boolean;
  handleClick: (beastieId: string, isSpoiler: boolean) => void;
}) {
  return (
    <div
      key={beastie.id}
      role="button"
      style={{
        display: visible ? "flex" : "none",
      }}
      className={styles.beastieSelectBeastie}
      onClick={() => handleClick(beastie.id, isSpoiler)}
    >
      <img
        className={styles.beastieSelectBeastieIm}
        src={
          isSpoiler
            ? "/gameassets/sprExclam_1.png"
            : `/icons/${beastie.name}.png`
        }
      />
      <div className={styles.beastieSelectNameNum}>
        <div className={styles.beastieSelectNum}>
          #{String(beastie.number).padStart(2, "0")}
        </div>
        <div>{isSpoiler ? "???" : beastie.name}</div>
      </div>
    </div>
  );
}

export default function BeastieSelect({
  beastieId,
  setBeastieId,
  textOverride,
}: {
  beastieId: string | undefined;
  setBeastieId: (beastie: string | undefined) => void;
  textOverride?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const beastie = beastieId ? BEASTIE_DATA.get(beastieId) : undefined;

  const [spoilerMode] = useSpoilerMode();
  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();

  const handleClick = useCallback(
    (beastieId: string, isSpoiler: boolean) => {
      if (isSpoiler) {
        setSeenBeasties((prev) => ({
          [beastieId]: true,
          ...prev,
        }));
        return;
      }
      setBeastieId(beastieId);
      setOpen(false);
    },
    [setBeastieId, setSeenBeasties],
  );

  return (
    <>
      <button onClick={() => setOpen(true)}>
        {textOverride
          ? textOverride
          : `Select Beastie: ${beastie?.name ?? "Unset"}`}
      </button>
      <Modal
        header="Select Beastie"
        open={open}
        onClose={() => setOpen(false)}
        hashValue="BeastieSelect"
      >
        <label tabIndex={0}>
          Search:{" "}
          <input
            type="text"
            onChange={(event) => setSearch(event.currentTarget.value)}
            value={search}
          />
        </label>
        <div className={styles.beastieSelectContainer}>
          <div className={styles.beastieSelect}>
            <div
              key="unset"
              role="button"
              style={{
                display: "unset".includes(search.toLowerCase())
                  ? "flex"
                  : "none",
              }}
              className={styles.beastieSelectBeastie}
              onClick={() => {
                setBeastieId(undefined);
                setOpen(false);
              }}
            >
              Unset
            </div>
            {BEASTIES.map((beastie) => (
              <BeastieButton
                key={beastie.id}
                beastie={beastie}
                handleClick={handleClick}
                isSpoiler={
                  spoilerMode == SpoilerMode.OnlySeen &&
                  !seenBeasties[beastie.id]
                }
                visible={beastie.name
                  .toLowerCase()
                  .includes(search.toLowerCase())}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
