import { useCallback, useRef, useState } from "react";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { useIsSpoiler } from "./useSpoiler";
import { useLocalStorage } from "usehooks-ts";

const BEASTIES = [...BEASTIE_DATA.values()];

function BeastieButton({
  beastie,
  isSpoiler,
  selectable,
  nonSelectableReason,
  handleClick,
}: {
  beastie: BeastieType;
  isSpoiler: boolean;
  selectable: boolean;
  nonSelectableReason?: string;
  handleClick: (beastieId: string, isSpoiler: boolean) => void;
}) {
  return (
    <div
      key={beastie.id}
      role="button"
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

enum FilterMode {
  None,
  NoMetamorph,
  Metamorphs,
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

  const [isSpoiler, setSeen] = useIsSpoiler();

  const clickedRef = useRef<[boolean, string | undefined]>([false, undefined]);

  const handleClick = useCallback(
    (beastieId: string, isSpoiler: boolean) => {
      if (isSpoiler) {
        setSeen(beastieId);
        return;
      }
      clickedRef.current = [true, beastieId];
      setOpen(false);
    },
    [setSeen],
  );

  const onClose = () => {
    setOpen(false);
    const [clicked, clickedBeastie] = clickedRef.current;
    if (clicked) {
      setBeastieId(clickedBeastie);
    }
    clickedRef.current = [false, undefined];
  };

  const [filterMode, setFilterMode] = useLocalStorage(
    "beastieSelectFilterMode",
    FilterMode.None,
  );

  const filterFunction: (beastie: BeastieType) => Boolean =
    filterMode == FilterMode.None
      ? () => true
      : filterMode == FilterMode.Metamorphs
        ? (beastie: BeastieType) =>
            !!beastie.evolution?.length &&
            beastie.evolution.some((evo) => evo.condition[0] != 7)
        : filterMode == FilterMode.NoMetamorph
          ? (beastie: BeastieType) =>
              !beastie.evolution?.length ||
              beastie.evolution.every((evo) => evo.condition[0] == 7)
          : () => true;

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
        <div className={styles.beastieSelectContainer}>
          <div>
            <label tabIndex={0}>
              Search:{" "}
              <input
                type="search"
                onChange={(event) => setSearch(event.currentTarget.value)}
                onFocus={(event) => event.currentTarget.select()}
                value={search}
              />
            </label>
            {" - "}
            <label>
              Filter:{" "}
              <select
                value={filterMode}
                onChange={(event) =>
                  setFilterMode(Number(event.currentTarget.value))
                }
              >
                <option value={FilterMode.None}>None</option>
                <option value={FilterMode.NoMetamorph}>
                  Can not Metamorph
                </option>
                <option value={FilterMode.Metamorphs}>Can Metamorph</option>
              </select>
            </label>
          </div>
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
                clickedRef.current = [true, undefined];
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
                  clickedRef.current = [true, extraOption];
                  setOpen(false);
                }}
              >
                {extraOptionText}
              </div>
            ) : null}
            {BEASTIES.filter(
              (beastie) =>
                beastie.name.toLowerCase().includes(search.toLowerCase()) &&
                filterFunction(beastie),
            ).map((beastie) => (
              <BeastieButton
                key={beastie.id}
                beastie={beastie}
                handleClick={handleClick}
                isSpoiler={isSpoiler(beastie.id)}
                selectable={!isSelectable || isSelectable(beastie)}
                nonSelectableReason={nonSelectableReason}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
