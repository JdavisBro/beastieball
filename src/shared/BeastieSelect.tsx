import { useState } from "react";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import BEASTIE_DATA from "../data/BeastieData";
import { SpoilerMode, useSpoilerMode, useSpoilerSeen } from "./useSpoiler";

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

  const beasties: React.ReactElement[] = [];

  beasties.push(
    <div
      key="unset"
      role="button"
      style={{
        display: "unset".includes(search.toLowerCase()) ? "flex" : "none",
      }}
      className={styles.beastieSelectBeastie}
      onClick={() => {
        setBeastieId(undefined);
        setOpen(false);
      }}
    >
      Unset
    </div>,
  );

  const [spoilerMode] = useSpoilerMode();
  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();

  const handleSpoilerClick = (spoilerBeastie: string) => {
    seenBeasties[spoilerBeastie] = true;
    setSeenBeasties(seenBeasties);
  };

  BEASTIE_DATA.forEach((beastie) => {
    const isSpoiler =
      spoilerMode == SpoilerMode.OnlySeen && !seenBeasties[beastie.id];
    beasties.push(
      <div
        key={beastie.id}
        role="button"
        style={{
          display: beastie.name.toLowerCase().includes(search.toLowerCase())
            ? "flex"
            : "none",
        }}
        className={styles.beastieSelectBeastie}
        onClick={() => {
          if (isSpoiler) {
            return handleSpoilerClick(beastie.id);
          }
          setBeastieId(beastie.id);
          setOpen(false);
        }}
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
      </div>,
    );
  });

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
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />
        </label>
        <div className={styles.beastieSelectContainer}>
          <div className={styles.beastieSelect}>{beasties}</div>
        </div>
      </Modal>
    </>
  );
}
