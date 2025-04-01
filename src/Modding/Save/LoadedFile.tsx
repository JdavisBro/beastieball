import SaveData, { SaveBeastie } from "./SaveType";
import styles from "./Save.module.css";
import Beastie from "./Beastie";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import { PropsWithChildren, useState } from "react";
import { BoxHeader } from "../../shared/InfoBox";

function FoldableSection(
  props: PropsWithChildren & { title: string; defaultOpen?: boolean },
): React.ReactElement {
  const [open, setOpen] = useState(props.defaultOpen ?? true);

  return (
    <>
      <div onClick={() => setOpen(!open)} className={styles.foldableHeader}>
        <span className={open ? styles.upArrow : ""}>V</span> {props.title}
      </div>
      <div className={open ? styles.foldable : styles.folded}>
        {props.children}
      </div>
    </>
  );
}

export default function LoadedFile(props: {
  save: SaveData;
}): React.ReactElement {
  const awayteam = props.save.away_games?.team ?? [];

  const reserve = Object.values(props.save.team_registry).filter(
    (value): value is SaveBeastie =>
      typeof value != "string" &&
      !awayteam.some((awayId) => awayId == value.pid),
  );
  const others = Object.values(props.save.beastie_bank).filter(
    (value): value is SaveBeastie => typeof value != "string",
  );

  return (
    <BeastieRenderProvider>
      <FoldableSection title="Team Humans">
        <div className={styles.beastiecontainer}>
          {props.save.team_party.map((value) => (
            <Beastie key={value.pid} beastie={value} />
          ))}
        </div>
      </FoldableSection>
      <FoldableSection title="Away Team" defaultOpen={false}>
        <div className={styles.beastiecontainer}>
          {awayteam ? (
            awayteam.map((pid) =>
              props.save.beastie_bank[pid] ? (
                <Beastie
                  key={pid}
                  beastie={props.save.beastie_bank[pid] as SaveBeastie}
                />
              ) : null,
            )
          ) : (
            <h1>No Away Team</h1>
          )}
        </div>
      </FoldableSection>
      <FoldableSection title="Reserve Humans" defaultOpen={false}>
        <div className={styles.beastiecontainer}>
          {reserve ? (
            reserve.map((value) => <Beastie key={value.pid} beastie={value} />)
          ) : (
            <h1>No Reserve Beasties</h1>
          )}
        </div>
      </FoldableSection>
      <FoldableSection title="Other Humans" defaultOpen={false}>
        <div className={styles.beastiecontainer}>
          {others.map((value) => (
            <Beastie key={value.pid} beastie={value} />
          ))}
        </div>
      </FoldableSection>
      <BoxHeader>All Values</BoxHeader>
      <div className={styles.datatable}>
        {Object.keys(props.save)
          .sort((a, b) => a.localeCompare(b))
          .map((key) => (
            <div key={key} className={styles.datarow}>
              <div>{key}</div>
              <textarea
                onChange={(event) =>
                  (props.save[key] = JSON.parse(event.currentTarget.value))
                }
                defaultValue={JSON.stringify(props.save[key])}
              ></textarea>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(props.save[key]))
                }
              >
                Copy
              </button>
            </div>
          ))}
      </div>
    </BeastieRenderProvider>
  );
}
