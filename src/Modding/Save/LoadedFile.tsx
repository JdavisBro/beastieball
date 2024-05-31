import SaveData from "./SaveType";
import styles from "./Save.module.css";
import Beastie from "./Beastie";

export default function LoadedFile(props: {
  save: SaveData;
}): React.ReactElement {
  return (
    <>
      <textarea defaultValue={JSON.stringify(props.save)}></textarea>
      <div className={styles.header}>Team Beasties</div>
      <div className={styles.varcontainer}>
        {props.save.team_party.map((value) => (
          <Beastie key={value.pid} beastie={value} />
        ))}
      </div>
      <div className={styles.header}>Reserve Beasties</div>
      <div className={styles.varcontainer}>
        {Object.values(props.save.team_registry).map((value) =>
          typeof value != "string" ? (
            <Beastie key={value.pid} beastie={value} />
          ) : null,
        )}
      </div>
      <div className={styles.header}>Other Beasties</div>
      <div className={styles.varcontainer}>
        {Object.values(props.save.beastie_bank).map((value) =>
          typeof value != "string" ? (
            <Beastie key={value.pid} beastie={value} />
          ) : null,
        )}
      </div>
      <div className={styles.header}>All Values</div>
      <div className={styles.datatable}>
        {Object.keys(props.save)
          .sort((a, b) => a.localeCompare(b))
          .map((key) => (
            <div key={key} className={styles.datarow}>
              <div>{key}</div>
              <textarea
                onChange={(event) =>
                  (props.save[key] = JSON.parse(event.target.value))
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
    </>
  );
}
