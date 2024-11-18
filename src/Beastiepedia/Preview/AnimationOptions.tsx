import { BeastieType } from "../../data/BeastieData";
import InfoBox from "../../shared/InfoBox";
import styles from "./ContentPreview.module.css";

type Props = {
  animPausedRef: React.MutableRefObject<boolean>;
  pausedButtonRef: React.RefObject<HTMLButtonElement>;
  frameInputRef: React.RefObject<HTMLInputElement>;
  animation: string;
  setAnimation: React.Dispatch<React.SetStateAction<string>>;
  animationList: string[];
  frameCount: number;
  setFrame: (frame: number) => void;
  changeFrame: (diff: number) => void;
  userSpeed: number;
  setUserSpeed: React.Dispatch<React.SetStateAction<number>>;
  beastiedata: BeastieType;
  alt: number;
  setAlt: React.Dispatch<React.SetStateAction<number>>;
};

export default function AnimationOptions(props: Props): React.ReactElement {
  return (
    <>
      <InfoBox header="Animation">
        {props.beastiedata.spr_alt.length ? (
          <>
            <label htmlFor="altSprite">Alt Sprite: </label>
            <select
              name="altSprite"
              id="altSprite"
              onChange={(event) =>
                props.setAlt(Number(event.currentTarget.value))
              }
              value={props.alt}
            >
              <option value="-1">Normal</option>
              {props.beastiedata.spr_alt.map((sprindex, index) => (
                <option key={sprindex} value={index}>
                  Alt {index + 1}
                </option>
              ))}
            </select>
            <br />
          </>
        ) : null}
        <label htmlFor="anim">Animation: </label>
        <select
          name="anim"
          id="anim"
          onChange={(event) => {
            props.animPausedRef.current = false;
            props.setAnimation(event.currentTarget.value);
          }}
          value={props.animation}
        >
          {props.animationList.map((value: string) => (
            <option value={value} key={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </option>
          ))}
        </select>
        <br />
        <button onClick={() => props.changeFrame(-1)}>{"<-"}</button>
        <button
          ref={props.pausedButtonRef}
          onClick={() => {
            props.animPausedRef.current = !props.animPausedRef.current;
          }}
        >
          PAUSE
        </button>
        <button onClick={() => props.changeFrame(1)}>{"->"}</button>
        <br />
        <label htmlFor="framenum">Frame: </label>
        <input
          ref={props.frameInputRef}
          type="number"
          id="framenum"
          name="framenum"
          min={0}
          max={props.frameCount}
          onChange={(event) => {
            props.animPausedRef.current = true;
            props.setFrame(Number(event.currentTarget.value));
          }}
        />
        <div className={styles.middlealign}>
          <label htmlFor="speed">Speed: x</label>
          <input
            type="number"
            name="speed"
            id="speed"
            step={0.1}
            min={0}
            value={props.userSpeed}
            style={{ width: "4em" }}
            onChange={(event) =>
              props.setUserSpeed(Number(event.currentTarget.value))
            }
          />
          <button onClick={() => props.setUserSpeed(1)}>Reset</button>
        </div>
      </InfoBox>
    </>
  );
}
