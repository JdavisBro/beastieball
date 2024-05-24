import SaveData from "./SaveType";
import styles from "./Save.module.css";

export default function LoadedFile(props: {
  save: SaveData;
}): React.ReactElement {
  return (
    <>
      <textarea>{JSON.stringify(props.save)}</textarea>
      <div className={styles.header}>Unknown Values</div>
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
