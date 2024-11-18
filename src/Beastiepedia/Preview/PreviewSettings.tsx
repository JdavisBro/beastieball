import InfoBox from "../../shared/InfoBox";
import styles from "./ContentPreview.module.css";

type Props = {
  downloadImage: (copy?: boolean) => void;
  downloadGif: () => void;
  gifDisabled: boolean;
  userSpeed: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  defaultSize: number;
  setBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  fitBeastie: boolean;
  setFitBeastie: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PreviewSettings(props: Props): React.ReactElement {
  return (
    <>
      <InfoBox header="Settings" className={styles.previewSettings}>
        <div className={styles.middlealign}>
          <button onClick={() => props.downloadImage()}>Save PNG</button>
          <button onClick={() => props.downloadImage(true)}>Copy PNG</button>
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
        <label>
          Display Size:{" "}
          <input
            type="range"
            min={25}
            max={100}
            step={5}
            defaultValue={props.defaultSize}
            onChange={(event) => {
              if (
                props.canvasRef.current &&
                props.canvasRef.current.parentElement
              ) {
                props.canvasRef.current.parentElement.style.width = `${event.currentTarget.value}%`;
              }
            }}
          />
        </label>
        <div className={styles.middlealign}>
          <label htmlFor="whitebg" style={{ userSelect: "none" }}>
            Background:
            <input
              id="whitebg"
              type="checkbox"
              onChange={(event) => {
                props.setBackground(event.currentTarget.checked);
              }}
            />
            <input
              type="color"
              defaultValue={"#ffffff"}
              onChange={(event) => {
                props.setBackgroundColor(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <label>
          Crop to Beastie:
          <input
            type="checkbox"
            defaultChecked={props.fitBeastie}
            onChange={(event) => {
              props.setFitBeastie(event.currentTarget.checked);
            }}
          />
        </label>
      </InfoBox>
    </>
  );
}
