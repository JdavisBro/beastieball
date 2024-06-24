import InfoBox from "../../shared/InfoBox";
import styles from "../Content.module.css";

type Props = {
  downloadImage: () => void;
  downloadGif: () => void;
  gifDisabled: boolean;
  userSpeed: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  fitBeastie: boolean;
  setFitBeastie: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PreviewSettings(props: Props): React.ReactElement {
  return (
    <>
      {" "}
      <InfoBox header="Settings">
        <div className={styles.middlealign}>
          <button onClick={props.downloadImage}>Save PNG</button>
          <button onClick={props.downloadGif} disabled={props.gifDisabled}>
            Save GIF
          </button>
          {props.userSpeed > 1.2 ? (
            <span
              title="When using a high speed, GIFs might not save the speed correctly."
              style={{ cursor: "help", userSelect: "none" }}
            >
              ⚠
            </span>
          ) : null}
        </div>
        <div className={styles.middlealign}>
          <label htmlFor="sizeinput">Display Size: </label>
          <input
            name="sizeinput"
            id="sizeinput"
            type="range"
            min={25}
            max={100}
            step={5}
            defaultValue={70}
            onChange={(event) => {
              if (
                props.canvasRef.current &&
                props.canvasRef.current.parentElement
              ) {
                props.canvasRef.current.parentElement.style.width = `${event.target.value}%`;
              }
            }}
          />
        </div>
        <div className={styles.middlealign}>
          <label htmlFor="whitebg" style={{ userSelect: "none" }}>
            Background:{" "}
          </label>
          <input
            name="whitebg"
            id="whitebg"
            type="checkbox"
            onChange={(event) => {
              props.setBackground(event.target.checked);
            }}
          />
          <input
            type="color"
            defaultValue={"#ffffff"}
            onChange={(event) => {
              props.setBackgroundColor(event.target.value);
            }}
          />
        </div>
        <label htmlFor="fitbeastie">Crop to Beastie</label>
        <input
          id="fitbeastie"
          name="fitbeastie"
          type="checkbox"
          defaultChecked={props.fitBeastie}
          onChange={(event) => {
            props.setFitBeastie(event.target.checked);
          }}
        />
      </InfoBox>
    </>
  );
}
