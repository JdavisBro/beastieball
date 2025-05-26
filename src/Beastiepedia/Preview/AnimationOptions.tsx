import { BeastieType } from "../../data/BeastieData";
import useLocalization from "../../localization/useLocalization";
import InfoBox from "../../shared/InfoBox";

type Props = {
  paused: boolean;
  setPaused: (paused: boolean) => void;
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
  const { L } = useLocalization();

  const alt_nums = props.beastiedata.spr_alt.length > 1;
  return (
    <>
      <InfoBox header={L("beastiepedia.preview.animationOptions.header")}>
        {props.beastiedata.spr_alt.length ? (
          <>
            <label>
              {L("beastiepedia.preview.animationOptions.altSprite.label")}
              <select
                onChange={(event) =>
                  props.setAlt(Number(event.currentTarget.value))
                }
                value={props.alt}
              >
                <option value="-1">
                  {L("beastiepedia.preview.animationOptions.altSprite.normal")}
                </option>
                {props.beastiedata.spr_alt.map((sprindex, index) => (
                  <option key={sprindex} value={index}>
                    {alt_nums
                      ? L(
                          "beastiepedia.preview.animationOptions.altSprite.alternateNumbered",
                          { num: String(index + 1) },
                        )
                      : L(
                          "beastiepedia.preview.animationOptions.altSprite.alternate",
                        )}
                  </option>
                ))}
              </select>
            </label>
            <br />
          </>
        ) : null}
        <label>
          {L("beastiepedia.preview.animationOptions.animLabel")}
          <select
            onChange={(event) => {
              props.setPaused(false);
              props.setAnimation(event.currentTarget.value);
            }}
            value={props.animation}
          >
            {props.animationList.map((value: string) => (
              <option value={value} key={value}>
                {L("beastiepedia.preview.anim." + value)}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button onClick={() => props.changeFrame(-1)}>
          {L("beastiepedia.preview.animationOptions.prev")}
        </button>
        <button
          onClick={() => {
            props.setPaused(!props.paused);
          }}
        >
          {L(
            "beastiepedia.preview.animationOptions." +
              (props.paused ? "play" : "pause"),
          )}
        </button>
        <button onClick={() => props.changeFrame(1)}>
          {L("beastiepedia.preview.animationOptions.next")}
        </button>
        <br />
        <label>
          {L("beastiepedia.preview.animationOptions.frameLabel")}
          <input
            ref={props.frameInputRef}
            type="number"
            min={0}
            max={props.frameCount}
            onChange={(event) => {
              props.setPaused(true);
              props.setFrame(Number(event.currentTarget.value));
            }}
          />
        </label>
        <div>
          <label>
            {L("beastiepedia.preview.animationOptions.speedLabel")}
            <input
              type="number"
              step={0.1}
              min={0}
              value={props.userSpeed}
              style={{ width: "4em" }}
              onChange={(event) =>
                props.setUserSpeed(Number(event.currentTarget.value))
              }
            />
          </label>
          <button onClick={() => props.setUserSpeed(1)}>
            {L("beastiepedia.preview.animationOptions.speedReset")}
          </button>
        </div>
      </InfoBox>
    </>
  );
}
