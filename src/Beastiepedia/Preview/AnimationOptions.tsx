import { BeastieType } from "../../data/BeastieData";
import InfoBox from "../../shared/InfoBox";
import { ANIMATION_LIST } from "./ContentPreview";

type Props = {
  paused: boolean;
  setPaused: (paused: boolean) => void;
  frameInputRef: React.Ref<HTMLInputElement>;
  animation: string;
  setAnimation: React.Dispatch<React.SetStateAction<string>>;
  animationAllowed: Record<string, boolean>;
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
  const alt_nums = props.beastiedata.spr_alt.length > 1;
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
                  Alternate
                  {alt_nums ? ` ${index + 1}` : ""}
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
            props.setPaused(false);
            props.setAnimation(event.currentTarget.value);
          }}
          value={props.animation}
        >
          {ANIMATION_LIST.map((value: string) => (
            <option
              value={value}
              key={value}
              disabled={!props.animationAllowed[value]}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </option>
          ))}
        </select>
        <br />
        <button onClick={() => props.changeFrame(-1)}>{"<-"}</button>
        <button
          onClick={() => {
            props.setPaused(!props.paused);
          }}
        >
          {props.paused ? "PLAY" : "PAUSE"}
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
            props.setPaused(true);
            props.setFrame(Number(event.currentTarget.value));
          }}
        />
        <div>
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
