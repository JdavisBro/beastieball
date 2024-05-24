import pako from "pako";

import { useState } from "react";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import styles from "./Save.module.css";
import SaveData from "./SaveType";
import LoadedFile from "./LoadedFile";

function CopyableString(props: { children: string }) {
  return (
    <span className={styles.copyablestring}>
      <code>{props.children}</code>
      <button onClick={() => navigator.clipboard.writeText(props.children)}>
        Copy
      </button>
    </span>
  );
}

declare global {
  interface Window {
    save: SaveData | null;
  }
}

export default function Save(): React.ReactElement {
  const [filename, setFilename] = useState("file_0");
  const [save, setSave] = useState<SaveData | null>(null);

  window.save = save;

  return (
    <div className={styles.container}>
      <OpenGraph
        title="Beastieball Save Viewer"
        image="gameassets/sprMainmenu/10.png"
        url="modding/save/"
        description="Save Viewer/Editor for Beastieball"
      />
      <Header
        title="Beastieball Save Viewer"
        returnButtonTitle="Beastieball Modding Tools"
        returnButtonTo="/modding/"
      />
      <div className={styles.belowheader}>
        <br />
        <div className={styles.header}>Save Locations</div>
        <div className={styles.varcontainer}>
          Windows:{" "}
          <CopyableString>%localappdata%\beastieball\save\</CopyableString>
          <br />
          Mac:{" "}
          <CopyableString>
            ~/Library/Application Support/com.wishes.beastieball/save/
          </CopyableString>
          <br />
          Linux (proton, demo):{" "}
          <CopyableString>
            ~/.local/share/Steam/steamapps/compatdata/2404130/pfx/drive_c/users/steamuser/AppData/Local/beastieball/save/
          </CopyableString>
        </div>
        <div className={styles.header}>Load/Save File</div>
        <div className={styles.varcontainer}>
          <button>New</button>
          <br />
          <input
            type="file"
            onChange={(event) => {
              const files = event.target.files;
              if (files) {
                const file = files[0];
                file.arrayBuffer().then((data) => {
                  const decompressed = pako.inflate(data, { to: "string" });
                  setFilename(file.name);
                  setSave(JSON.parse(decompressed));
                });
              }
            }}
            onClick={(event) => ((event.target as HTMLInputElement).value = "")}
          />
          <br />
          <button
            onClick={() => {
              if (!save) {
                return;
              }
              const a = document.createElement("a");
              const blob = new Blob([pako.deflate(JSON.stringify(save))]);
              a.download = filename;
              a.href = URL.createObjectURL(blob);
              a.click();
            }}
          >
            Save File
          </button>
        </div>
        {save ? <LoadedFile save={save} /> : null}
      </div>
    </div>
  );
}
