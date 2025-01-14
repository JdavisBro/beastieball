import { useCallback, useRef, useState } from "react";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { SpoilerMode, useSpoilerMode, useSpoilerSeen } from "./useSpoiler";

const BEASTIES = [...BEASTIE_DATA.values()];

function BeastieButton({
  beastie,
  isSpoiler,
  visible,
  selectable,
  nonSelectableReason,
  handleClick,
}: {
  beastie: BeastieType;
  isSpoiler: boolean;
  visible: boolean;
  selectable: boolean;
  nonSelectableReason?: string;
  handleClick: (beastieId: string, isSpoiler: boolean) => void;
}) {
  return (
    <div
      key={beastie.id}
      role="button"
      style={{
        display: visible ? "flex" : "none",
      }}
      tabIndex={selectable ? 0 : -1}
      className={
        selectable
          ? styles.beastieSelectBeastie
          : styles.beastieSelectBeastieNoSel
      }
      title={selectable ? undefined : nonSelectableReason}
      onClick={
        selectable ? () => handleClick(beastie.id, isSpoiler) : undefined
      }
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
  extraOptionText,
  extraOption,
  isSelectable,
  nonSelectableReason,
}: {
  beastieId: string | undefined;
  setBeastieId: (beastie: string | undefined) => void;
  textOverride?: string;
  extraOptionText?: string;
  extraOption?: string;
  isSelectable?: (beastie: BeastieType) => boolean;
  nonSelectableReason?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const beastie = beastieId ? BEASTIE_DATA.get(beastieId) : undefined;

  const [spoilerMode] = useSpoilerMode();
  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();

  const clickedRef = useRef<[boolean, string | undefined]>([false, undefined]);

  const handleClick = useCallback(
    (beastieId: string, isSpoiler: boolean) => {
      if (isSpoiler) {
        setSeenBeasties((prev) => ({
          [beastieId]: true,
          ...prev,
        }));
        return;
      }
      clickedRef.current = [true, beastieId];
      setOpen(false);
    },
    [setSeenBeasties],
  );

  const onClose = () => {
    setOpen(false);
    const [clicked, clickedBeastie] = clickedRef.current;
    if (clicked) {
      setBeastieId(clickedBeastie);
    }
    clickedRef.current = [false, undefined];
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>
        {textOverride
          ? textOverride
          : `Select Beastie: ${beastie?.name ?? (extraOption && beastieId == extraOption ? extraOptionText : "Unset")}`}
      </button>
      <Modal
        header="Select Beastie"
        open={open}
        onClose={onClose}
        hashValue="BeastieSelect"
      >
        <label tabIndex={0}>
          Search:{" "}
          <input
            type="search"
            onChange={(event) => setSearch(event.currentTarget.value)}
            onFocus={(event) => event.currentTarget.select()}
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
              tabIndex={0}
              className={styles.beastieSelectBeastie}
              onClick={() => {
                setBeastieId(undefined);
                setOpen(false);
              }}
            >
              Unset
            </div>
            {extraOption && extraOptionText ? (
              <div
                key={extraOption}
                role="button"
                style={{
                  display: extraOptionText
                    .toLowerCase()
                    .includes(search.toLowerCase())
                    ? "flex"
                    : "none",
                }}
                tabIndex={0}
                className={styles.beastieSelectBeastie}
                onClick={() => {
                  setBeastieId(extraOption);
                  setOpen(false);
                }}
              >
                {extraOptionText}
              </div>
            ) : null}
            {BEASTIES.map((beastie) => (
              <BeastieButton
                key={beastie.id}
                beastie={beastie}
                handleClick={handleClick}
                isSpoiler={
                  spoilerMode == SpoilerMode.OnlySeen &&
                  !seenBeasties[beastie.id]
                }
                selectable={!isSelectable || isSelectable(beastie)}
                nonSelectableReason={nonSelectableReason}
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
