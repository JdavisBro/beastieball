import { useEffect, useState } from "react";
import OpenGraph from "../shared/OpenGraph";
import useLocalization, {
  LocalizationFunction,
} from "../localization/useLocalization";
import Header from "../shared/Header";
import { WorkshopData } from "./types";
import InfoTabberHeader from "../shared/InfoTabber";
import WorkshopEditPlay from "./Play";
import JSZip from "jszip";
import BEASTIE_DATA from "../data/BeastieData";

export function StringDataInput({
  value,
  setValue,
}: {
  value: string;
  setValue: (new_value: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}

function WorkshopEditData({
  workshopData,
  setWorkshopData,
}: {
  workshopData: WorkshopData;
  setWorkshopData: React.Dispatch<React.SetStateAction<WorkshopData>>;
}) {
  const { L } = useLocalization();

  const setKey: <T extends keyof WorkshopData>(
    key: T,
    value: WorkshopData[T],
  ) => void = (key, value) => {
    setWorkshopData((data) => {
      return { ...data, [key]: value };
    });
  };

  return (
    <div
      className="infoBoxContent"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <label>
        Name:{" "}
        <StringDataInput
          value={workshopData.name}
          setValue={(value) => setKey("name", value)}
        />
      </label>
      <label>
        Author:{" "}
        <StringDataInput
          value={workshopData.author}
          setValue={(value) => setKey("author", value)}
        />
      </label>
      <div>
        <label>
          Version Major{" "}
          <input
            type="number"
            value={workshopData.major_version}
            onChange={(event) =>
              setKey("major_version", event.currentTarget.value)
            }
          />
        </label>
        <label>
          Minor <input type="number" value={workshopData.minor_version} />
        </label>
      </div>
      <button
        onClick={() => {
          setWorkshopData((old_data) => ({
            ...old_data,
            plays: [
              ...old_data.plays,
              {
                name: "",
                type: 0,
                use: 0,
                pow: 0,
                target: 0,
                effects: [],
                learnedby: [],
              },
            ],
          }));
        }}
      >
        Add Play
      </button>
      <button onClick={() => saveZip(workshopData, L)}>Save</button>
    </div>
  );
}

function WorkshopInner({
  workshopData,
  setWorkshopData,
}: {
  db: IDBDatabase;
  workshopData: WorkshopData;
  setWorkshopData: React.Dispatch<React.SetStateAction<WorkshopData>>;
}) {
  const [tab, setTab] = useState(0);

  const tabs = [
    [
      "Mod Info",
      <WorkshopEditData
        workshopData={workshopData}
        setWorkshopData={setWorkshopData}
      />,
    ],
  ].concat(
    workshopData.plays.map((play, index) => [
      `Play ${index + 1}: ${play.name}`,
      <WorkshopEditPlay
        key={index}
        play={play}
        setPlay={(new_play) =>
          setWorkshopData((old_data) => {
            old_data.plays[index] =
              typeof new_play == "function"
                ? new_play(old_data.plays[index])
                : new_play;
            return { ...old_data, plays: old_data.plays };
          })
        }
        deletePlay={() => {
          setWorkshopData((old_data) => {
            old_data.plays.splice(index, 1);
            return { ...old_data, plays: old_data.plays };
          });
        }}
      />,
    ]),
  );

  return (
    <div>
      <InfoTabberHeader
        tab={tab}
        setTab={setTab}
        tabs={tabs.map(([tabName]) => tabName)}
      />
      {tabs[tab]?.[1]}
    </div>
  );
}

const ID_CHARS = "0123456789BCDFGHJKLMNPQRTVWXY";

const DATE_OFFSET = 25569;

function newWorkshopData(): WorkshopData {
  const id_date = Math.floor(
    (DATE_OFFSET + new Date().getTime() / 1000 / 60 / 60 / 24) * 100,
  );

  return {
    name: "",
    description: "",
    author: "",
    url: "",
    major_version: "0",
    minor_version: "0",
    internal_id:
      new Array(6)
        .fill(0)
        .map(() => ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)])
        .reduce((p, v) => p + v) + id_date,
    finished: "0.0",
    plays: [],
    music: [],
    beasties: [],
  };
}

function iniValueToString(value: any) {
  switch (typeof value) {
    case "number":
      return String(value);
    case "object":
      if (Array.isArray(value)) return value.join(",");
      break;
    case "string":
      return `"${value}"`;
  }
  return `"${value}"`;
}

function createIni(data: Record<string, Record<string, any>>) {
  return Object.keys(data)
    .flatMap((header) =>
      [`[${header}]`].concat(
        Object.keys(data[header]).map(
          (key) => `${key}=${iniValueToString(data[header][key])}`,
        ),
      ),
    )
    .join("\n");
}

/* prettier-ignore */
const BANNED_FILENAMES = [
  "CON", "PRN", "AUX", "NUL",
  "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
  "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9",
  ".", "..",
]

function sanitizeFilename(name: string, doneFilenames?: string[]) {
  let filename = name.replace(/[:\\\/<>"|?*]/g, "-");
  if (
    BANNED_FILENAMES.includes(filename) ||
    filename.endsWith(" ") ||
    filename.endsWith(".")
  )
    filename += "_";
  let finalFilename = filename;
  if (doneFilenames !== undefined) {
    let index = 1;
    while (doneFilenames.includes(finalFilename)) {
      finalFilename = filename + "." + index;
      index += 1;
    }
    doneFilenames.push(finalFilename);
  }
  return finalFilename;
}

function saveZip(workshopData: WorkshopData, L: LocalizationFunction) {
  const zip = new JSZip();
  const base = sanitizeFilename(workshopData.name);
  zip.file(
    `${base}/config.ini`,
    createIni({
      general: {
        name: workshopData.name,
        description: workshopData.description,
        author: workshopData.author,
        url: workshopData.url,
        major_version: workshopData.major_version,
        minor_version: workshopData.minor_version,
        internal_id: workshopData.internal_id,
        finished: workshopData.finished,
      },
    }),
  );
  const doneFilenames: string[] = [];
  for (const play of workshopData.plays) {
    zip.file(
      `${base}/${sanitizeFilename(play.name, doneFilenames)}/play_data.ini`,
      createIni({
        basic: {
          name: play.name,
          type: play.type,
          use: play.use,
          pow: play.pow,
          target: play.target,
        },
        effects: {
          effects: play.effects
            .flatMap((effect) => [effect.eff, effect.targ, effect.pow])
            .join(","),
        },
        distribution: {
          learnedby: play.learnedby
            .map((beastie) =>
              L(BEASTIE_DATA.get(beastie)?.name ?? "", undefined, true),
            )
            .join(","),
        },
      }),
    );
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    const a = document.createElement("a");
    a.download = `${workshopData.name}.zip`;
    a.href = URL.createObjectURL(content);
    a.click();
  });
}

export default function Workshop() {
  const { L } = useLocalization();

  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [dbError, setDbError] = useState(false);

  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null);

  const getDb = () => {
    const request = indexedDB.open("Workshop");
    request.onsuccess = () => {
      const db = request.result;
      setDb(db);
      setDbError(false);
    };
    request.onerror = () => {
      setDbError(true);
    };
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("Mod1");
    };
  };

  useEffect(getDb, []);

  useEffect(() => {
    if (!db) return;
    const transaction = db.transaction("Mod1");
    const store = transaction.objectStore("Mod1");
    const request = store.get("data.json");
    console.log(request);
    request.onsuccess = () => {
      if (request.result) {
        setWorkshopData(request.result);
      } else {
        setWorkshopData(newWorkshopData());
      }
    };
    request.onerror = () => {
      console.log("boo");
      setWorkshopData(newWorkshopData());
    };
  }, [db]);

  useEffect(() => {
    if (!db || !workshopData) return;
    const transaction = db.transaction("Mod1", "readwrite");
    const store = transaction.objectStore("Mod1");
    store.put(workshopData, "data.json");
  }, [db, workshopData]);

  return (
    <>
      <OpenGraph
        title={L("common.title", {
          page: L("Workshop"),
          branding: import.meta.env.VITE_BRANDING,
        })}
        description={L("Workshop Description")}
        image="gameassets/sprMainmenu/12.png"
        url="workshop/"
      />
      <Header title={L("Workshop")} returnButtonTo="/workshop/" />
      {db && workshopData ? (
        <WorkshopInner
          db={db}
          workshopData={workshopData}
          setWorkshopData={(new_data) =>
            setWorkshopData((old_data) =>
              typeof new_data == "function"
                ? new_data(old_data ?? newWorkshopData())
                : new_data,
            )
          }
        />
      ) : dbError ? (
        <>
          eror<button onClick={getDb}>tryagain</button>
        </>
      ) : (
        "loading"
      )}
    </>
  );
}
