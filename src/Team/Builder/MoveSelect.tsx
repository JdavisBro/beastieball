import { useState } from "react";

import MOVE_DIC, { Move } from "../../data/MoveData";
import styles from "./TeamBuilder.module.css";
import useLocalization from "../../localization/useLocalization";
import { useLocation, useNavigate } from "react-router-dom";
import { BeastieType } from "../../data/BeastieData";
import { MoveSelectModal } from "../../shared/MoveSelect";

export default function BuilderMoveSelect({
  beastiedata,
  teamBeastieMovelist,
  setMove,
  chaosMode,
}: {
  beastiedata: BeastieType;
  teamBeastieMovelist: string[];
  setMove: (index: number, move: string) => void;
  chaosMode: boolean;
}) {
  const { L } = useLocalization();

  const hash = decodeURIComponent(useLocation().hash);
  const hashMoveNum = hash.startsWith("#SelectPlay-") && Number(hash.slice(12));
  const hashSelecting =
    hashMoveNum && hashMoveNum >= 1 && hashMoveNum <= 3 && hashMoveNum - 1;

  const [selectingState, setSelecting] = useState<undefined | number>(
    undefined,
  );
  const selecting =
    selectingState ?? (hashSelecting === false ? undefined : hashSelecting);

  const navigate = useNavigate();
  const selectMove = (move: Move | undefined) => {
    if (move) {
      setMove(selecting ?? 0, move.id);
    }
    setSelecting(undefined);
    navigate(-1);
  };

  return (
    <div className={styles.box}>
      <MoveSelectModal
        move={undefined}
        setMove={selectMove}
        hashName={String((selecting ?? 0) + 1)}
        header={L("teams.builder.playSelect.title", {
          num: String((selecting ?? 0) + 1),
        })}
        open={selecting != undefined}
        setOpen={(open) => setSelecting(open ? selecting : undefined)}
        beastie={chaosMode ? undefined : beastiedata}
      />
      {L("teams.builder.plays")}
      <button onClick={() => setSelecting(0)}>
        {L("teams.builder.playSelect.num", {
          num: "1",
          move: MOVE_DIC[teamBeastieMovelist[0]]
            ? L(MOVE_DIC[teamBeastieMovelist[0]].name)
            : L("teams.builder.playSelect.unset"),
        })}
      </button>
      <button onClick={() => setSelecting(1)}>
        {L("teams.builder.playSelect.num", {
          num: "2",
          move: MOVE_DIC[teamBeastieMovelist[1]]
            ? L(MOVE_DIC[teamBeastieMovelist[1]].name)
            : L("teams.builder.playSelect.unset"),
        })}
      </button>
      <button onClick={() => setSelecting(2)}>
        {L("teams.builder.playSelect.num", {
          num: "3",
          move: MOVE_DIC[teamBeastieMovelist[2]]
            ? L(MOVE_DIC[teamBeastieMovelist[2]].name)
            : L("teams.builder.playSelect.unset"),
        })}
      </button>
    </div>
  );
}
