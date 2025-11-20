import SaveData, { SaveBeastie } from "./SaveType";
import styles from "./Save.module.css";
import Beastie from "./Beastie";
import BeastieRenderProvider from "../../shared/beastieRender/BeastieRenderProvider";
import { Fragment, memo, useState } from "react";
import InfoTabberHeader from "../../shared/InfoTabber";

const BeastieMemo = memo(Beastie);

function BeastieContainer({
  beasties,
  visible,
}: {
  beasties: SaveBeastie[];
  visible: boolean;
}) {
  const container = visible
    ? styles.beastiecontainer
    : styles.beastiecontainerhidden;
  if (!beasties.length) {
    return <div className={container}>No Beasties</div>;
  }
  return (
    <div className={container}>
      {beasties.map((value) => (
        <BeastieMemo key={value.pid} beastie={value} />
      ))}
    </div>
  );
}

function BeastieSection({ save }: { save: SaveData }) {
  const [beastieTab, setBeastieTab] = useState(0);

  const awayteam =
    save.away_games?.team.map((pid) => save.beastie_bank[pid] as SaveBeastie) ??
    [];

  const reserve = Object.values(save.team_registry).filter(
    (value): value is SaveBeastie =>
      typeof value != "string" &&
      !awayteam.some((away) => away.pid == value.pid),
  );
  const others = Object.values(save.beastie_bank).filter(
    (value): value is SaveBeastie => typeof value != "string",
  );

  return (
    <>
      <InfoTabberHeader
        tab={beastieTab}
        setTab={setBeastieTab}
        tabs={[
          "Team Beasties",
          "Reserve Beasties",
          "Other Beasties",
          "Away Team",
        ]}
      />
      <BeastieContainer beasties={save.team_party} visible={beastieTab == 0} />
      <BeastieContainer beasties={reserve} visible={beastieTab == 1} />
      <BeastieContainer beasties={others} visible={beastieTab == 2} />
      <BeastieContainer beasties={awayteam} visible={beastieTab == 3} />
    </>
  );
}

const BeastieSectionMemo = memo(BeastieSection);

export default function LoadedFile({
  save,
}: {
  save: SaveData;
}): React.ReactElement {
  const [tab, setTab] = useState(0);

  return (
    <BeastieRenderProvider>
      <InfoTabberHeader
        tab={tab}
        setTab={setTab}
        tabs={["Beasties", "All Values"]}
      />
      <div className={tab == 0 ? undefined : styles.sectionhidden}>
        <BeastieSectionMemo save={save} />
      </div>
      <div className={tab == 1 ? undefined : styles.sectionhidden}>
        <ValuesSection save={save} />
      </div>
    </BeastieRenderProvider>
  );
}
function ValuesSection({ save }: { save: SaveData }) {
  const [search, setSearch] = useState("");
  const searchStr = search.toLowerCase().replace(/ /g, "_");

  return (
    <div className={styles.datatable}>
      <div className={styles.visible}>
        Key{" "}
        <input
          type="search"
          onChange={(event) => setSearch(event.currentTarget.value)}
          value={search}
        />
      </div>
      <div className={styles.visible}>Value</div>
      <div className={styles.visible}>Copy</div>
      {Object.keys(save)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => {
          const visible = !search || key.toLowerCase().includes(searchStr);
          return (
            <Fragment key={key}>
              <div className={visible ? styles.datakey : undefined}>{key}</div>
              <div className={visible ? styles.dataval : undefined}>
                <textarea
                  onChange={(event) =>
                    (save[key] = JSON.parse(event.currentTarget.value))
                  }
                  defaultValue={JSON.stringify(save[key])}
                ></textarea>
              </div>
              <button
                className={visible ? styles.visible : undefined}
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(save[key]))
                }
              >
                Copy
              </button>
            </Fragment>
          );
        })}
    </div>
  );
}
