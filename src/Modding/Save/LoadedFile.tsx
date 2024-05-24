import SaveData from "./SaveType";
import styles from "./Save.module.css";
import Beastie from "./Beastie";

export default function LoadedFile(props: {
  save: SaveData;
}): React.ReactElement {
  return (
    <>
      <textarea>{JSON.stringify(props.save)}</textarea>
      <div className={styles.header}>Team Beasties</div>
      <div className={styles.varcontainer}>
        {props.save.team_party.map((value) => (
          <Beastie beastie={value} />
        ))}
      </div>
      <div className={styles.header}>All Values</div>
      <div className={styles.datatable}>
        {Object.keys(props.save)
          .sort((a, b) => a.localeCompare(b))
          .map((key) => (
            <div className={styles.datarow}>
              <div>{key}</div>
              <textarea>{JSON.stringify(props.save[key])}</textarea>
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
    </>
  );
}
