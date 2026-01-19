import { useCallback, useRef, useState } from "react";

import styles from "./Shared.module.css";
import Modal from "./Modal";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import { useIsSpoiler } from "./useSpoiler";
import useLocalization from "../localization/useLocalization";
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
  const { L } = useLocalization();

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
            : `/icons/${L(beastie.name, undefined, true)}.png`
        }
      />
      <div className={styles.beastieSelectNameNum}>
        <div className={styles.beastieSelectNum}>
          #{String(beastie.number).padStart(2, "0")}
        </div>
        <div>{isSpoiler ? "???" : L(beastie.name)}</div>
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
  hashName,
  textOverride,
  extraOptionText,
  extraOption,
  isSelectable,
  nonSelectableReason,
}: {
  beastieId: string | undefined;
  setBeastieId: (beastie: string | undefined) => void;
  hashName: string;
  textOverride?: string;
  extraOptionText?: string;
  extraOption?: string;
  isSelectable?: (beastie: BeastieType) => boolean;
  nonSelectableReason?: string;
}) {
  const { L } = useLocalization();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const beastie = beastieId ? BEASTIE_DATA.get(beastieId) : undefined;

  const [isSpoiler, setSeen] = useIsSpoiler();

  const clickedRef = useRef<[boolean, string | undefined]>([false, undefined]);

  const handleClick = useCallback((beastieId: string, isSpoiler: boolean) => {
    if (isSpoiler) {
      setSeen(beastieId);
      return;
    }
    clickedRef.current = [true, beastieId];
    setOpen(false);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    const [clicked, clickedBeastie] = clickedRef.current;
    if (clicked) {
      setBeastieId(clickedBeastie);
    }
    clickedRef.current = [false, undefined];
  }, []);

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
          : L("common.beastieSelect.label", {
              beastie: beastie
                ? L(beastie.name)
                : extraOptionText && beastieId == extraOption
                  ? extraOptionText
                  : L("common.beastieSelect.unset"),
            })}
      </button>
      <Modal
        header={L("common.beastieSelect.title")}
        open={open}
        makeOpen={() => setOpen(true)}
        onClose={onClose}
        hashValue={`BeastieSelect-${hashName}`}
      >
        <div className={styles.beastieSelectContainer}>
          <div className={styles.beastieSelectOptions}>
            <label tabIndex={0}>
              {L("common.searchPrefix")}
              <input
                type="search"
                onChange={(event) => setSearch(event.currentTarget.value)}
                onFocus={(event) => event.currentTarget.select()}
                value={search}
              />
            </label>
            {L("common.beastieSelect.sep")}
            <label>
              {L("common.beastieSelect.filter")}
              <select
                value={filterMode}
                onChange={(event) =>
                  setFilterMode(Number(event.currentTarget.value))
                }
              >
                <option value={FilterMode.None}>
                  {L("common.beastieSelect.none")}
                </option>
                <option value={FilterMode.NoMetamorph}>
                  {L("common.beastieSelect.noMetamorph")}
                </option>
                <option value={FilterMode.Metamorphs}>
                  {L("common.beastieSelect.metamorph")}
                </option>
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
              {L("common.beastieSelect.unset")}
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
                L(beastie.name).toLowerCase().includes(search.toLowerCase()) &&
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
