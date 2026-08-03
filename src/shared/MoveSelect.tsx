import { useEffect, useRef, useState } from "react";

import styles from "./Shared.module.css";
import MOVE_DIC, { Move } from "../data/MoveData";
import Modal from "./Modal";
import useLocalization from "../localization/useLocalization";
import { BeastieType } from "../data/BeastieData";
import MoveView from "./MoveView";

type CommonProps = {
  moves?: Move[];
  move: Move | undefined;
  setMove: (move: Move | undefined) => void;
  hashName: string;
  header: string;
  beastie?: BeastieType;
};

type ModalProps = CommonProps & {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type ButtonProps = CommonProps & {
  textOverride?: string;
};

const IGNORED_MOVES = [
  "xtra",
  "???",
  "volley",
  "move",
  "defense",
  "doubleblock",
  "tagout",
];
const ALL_MOVES = Object.values(MOVE_DIC).filter(
  (move) => !IGNORED_MOVES.includes(move.id),
);

enum MoveFilterMode {
  None,
  Level,
  Friend,
}

export function MoveSelectModal({
  moves,
  setMove,
  hashName,
  header,
  open,
  setOpen,
  beastie,
}: ModalProps) {
  const { L } = useLocalization();

  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [filterType, setFilterType] = useState(-1);
  const [filterMode, setFilterMode] = useState(MoveFilterMode.None);

  let possibleMoves = moves ?? ALL_MOVES;
  if (beastie) {
    const learnset = beastie.learnset
      .map(([, move]) => MOVE_DIC[move as string])
      .filter((move) => !!move);
    if (filterMode == MoveFilterMode.Level) {
      possibleMoves = learnset;
    } else {
      const attklist = beastie.attklist
        .map((move) => MOVE_DIC[move])
        .filter((move) => !!move);
      possibleMoves =
        filterMode == MoveFilterMode.Friend
          ? attklist.filter(
              (move) => !learnset.some((lmove) => move.id == lmove.id),
            )
          : attklist;
    }
  }
  possibleMoves = possibleMoves.filter((move) =>
    L(move.name).toLowerCase().startsWith(search.toLowerCase()),
  );
  if (filterType != -1) {
    possibleMoves = possibleMoves.filter((move) => move.type == filterType);
  }
  if (!beastie || filterMode != MoveFilterMode.Level) {
    possibleMoves.sort(
      (move1, move2) =>
        move1.type - move2.type ||
        move2.pow - move1.pow ||
        L(move1.name).localeCompare(L(move2.name)),
    );
  }
  const handleSearchKey: React.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.key == "Enter" && search.length && possibleMoves.length) {
      event.preventDefault();
      event.stopPropagation();
      setMove(possibleMoves[0]);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) searchRef.current?.select();
  }, [open]);

  return (
    <Modal
      header={header}
      open={open}
      onClose={() => {
        setSearch("");
        setOpen(false);
      }}
      hashValue={`SelectPlay-${hashName}`}
    >
      <div className={styles.moveSelectModal}>
        <div className={styles.moveSelectOptions}>
          <label>
            {L("common.searchPrefix")}
            <input
              type="search"
              onChange={(event) => setSearch(event.currentTarget.value)}
              onFocus={(event) => event.currentTarget.select()}
              onKeyDown={handleSearchKey}
              value={search}
              ref={searchRef}
            />
          </label>
          {L("common.moveSelect.sep")}
          <label>
            {L("common.moveSelect.type.label")}
            <select
              value={filterType}
              onChange={(event) =>
                setFilterType(Number(event.currentTarget.value))
              }
            >
              <option value={-1}>{L("common.moveSelect.type.any")}</option>
              <option value={0}>{L("common.types.body")}</option>
              <option value={1}>{L("common.types.spirit")}</option>
              <option value={2}>{L("common.types.mind")}</option>
              <option value={3}>{L("common.types.volley")}</option>
              <option value={4}>{L("common.types.support")}</option>
              <option value={5}>{L("common.types.defense")}</option>
            </select>
          </label>
          {L("common.moveSelect.sep")}
          <label>
            {L("common.moveSelect.from.label")}
            <select
              value={filterMode}
              onChange={(event) =>
                setFilterMode(Number(event.currentTarget.value))
              }
              disabled={!beastie}
              style={{ opacity: !beastie ? "0.5" : undefined }}
            >
              <option value={MoveFilterMode.None}>
                {L("common.moveSelect.from.any")}
              </option>
              <option value={MoveFilterMode.Level}>
                {L("common.moveSelect.from.level")}
              </option>
              <option value={MoveFilterMode.Friend}>
                {L("common.moveSelect.from.friend")}
              </option>
            </select>
          </label>
        </div>
        <div className={styles.moveSelectGrid}>
          {possibleMoves.map((move) => (
            <div
              key={move.id}
              className={styles.moveSelectMove}
              onClick={() => {
                setMove(move);
                setOpen(false);
              }}
            >
              <MoveView move={move} noLearner={true} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default function MoveSelect({ textOverride, ...props }: ButtonProps) {
  const { L } = useLocalization();

  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        {textOverride ??
          L("common.moveSelect.label", {
            move: L(props.move?.name ?? "common.moveSelect.unset"),
          })}
      </button>
      <MoveSelectModal open={open} setOpen={setOpen} {...props} />
    </>
  );
}
