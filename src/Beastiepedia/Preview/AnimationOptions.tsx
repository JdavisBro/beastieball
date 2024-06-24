import InfoBox from "../../shared/InfoBox";
import styles from "../Content.module.css";

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
};

export default function AnimationOptions(props: Props): React.ReactElement {
  return (
    <>
      <InfoBox header="Animation">
        <select
          name="anim"
          id="anim"
          onChange={(event) => {
            props.animPausedRef.current = false;
            props.setAnimation(event.target.value);
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
        <input
          ref={props.frameInputRef}
          type="number"
          min={0}
          max={props.frameCount}
          onChange={(event) => {
            props.animPausedRef.current = true;
            props.setFrame(Number(event.target.value));
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
            onChange={(event) => props.setUserSpeed(Number(event.target.value))}
          />
          <button onClick={() => props.setUserSpeed(0.5)}>Reset</button>
        </div>
      </InfoBox>
    </>
  );
}
