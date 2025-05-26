import useLocalization from "../../localization/useLocalization";
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
  const { L } = useLocalization();
  return (
    <>
      <InfoBox
        header="Settings"
        container={{ className: styles.previewSettings }}
      >
        <div>
          <button onClick={() => props.downloadImage()}>
            {L("beastiepedia.preview.settings.savePNG")}
          </button>
          <button onClick={() => props.downloadImage(true)}>
            {L("beastiepedia.preview.settings.copyPNG")}
          </button>
          <button onClick={props.downloadGif} disabled={props.gifDisabled}>
            {L("beastiepedia.preview.settings.saveGIF")}
          </button>
          {props.userSpeed > 1.2 ? (
            <span
              title={L("beastiepedia.preview.settings.gifSpeedNote")}
              style={{ cursor: "help", userSelect: "none" }}
            >
              ⚠
            </span>
          ) : null}
        </div>
        <label>
          {L("beastiepedia.preview.settings.displaySizeLabel")}
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
                props.canvasRef.current.parentElement.style.maxWidth = `${event.currentTarget.value}%`;
              }
            }}
          />
        </label>
        <div>
          <label htmlFor="whitebg" style={{ userSelect: "none" }}>
            {L("beastiepedia.preview.settings.backgroundLabel")}
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
          {L("beastiepedia.preview.settings.cropLabel")}
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
