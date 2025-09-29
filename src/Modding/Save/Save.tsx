import pako from "pako";

import { useState } from "react";
import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import styles from "./Save.module.css";
import SaveData from "./SaveType";
import LoadedFile from "./LoadedFile";
import InfoBox from "../../shared/InfoBox";

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
        secretPage={true}
      />
      <div className={styles.belowheader}>
        <br />
        <InfoBox header="Save Locations">
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
        </InfoBox>
        <InfoBox header="Load/Save File">
          <button>New</button>
          <br />
          <input
            type="file"
            onChange={(event) => {
              const files = event.currentTarget.files;
              if (files) {
                const file = files[0];
                file
                  .arrayBuffer()
                  .then((data) => {
                    const decompressed = pako.inflate(data, { to: "string" });
                    const parsed = JSON.parse(decompressed);
                    if (
                      !parsed ||
                      typeof parsed != "object" ||
                      Array.isArray(parsed)
                    ) {
                      alert("Invalid File. Contents are not a save file.");
                      console.log(parsed);
                      return;
                    }
                    setFilename(file.name);
                    setSave(parsed);
                  })
                  .catch((reason) => {
                    const issuetype =
                      reason == "incorrect header check"
                        ? "Decompression issue: "
                        : "";
                    console.log(reason);
                    alert(`Invalid File. ${issuetype}${reason}`);
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
          Warning! This could mess up your save file! Please make backups and be
          careful!
        </InfoBox>
        {save ? <LoadedFile save={save} /> : null}
      </div>
    </div>
  );
}
