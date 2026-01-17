import { useState } from "react";
import { BeastieType } from "../../data/BeastieData";
import BEASTIE_SFX from "../../data/BeastieSfx";
import InfoBox from "../../shared/InfoBox";
import styles from "./ContentInfo.module.css";
import useLocalization from "../../localization/useLocalization";

function TypeList({
  type,
  count,
  currentSound,
  changeSound,
}: {
  type: string;
  count: number;
  currentSound: string;
  changeSound: (target: string) => void;
}) {
  const { L } = useLocalization();

  return (
    <div>
      <div className={styles.voiceType}>
        {L("beastiepedia.info.voice." + type)}
      </div>
      {[...new Array(count)].map((_, index) => (
        <button
          key={index}
          className={
            currentSound == `${type}_${index + 1}`
              ? styles.voiceButtonSelected
              : styles.voiceButton
          }
          onClick={() => changeSound(`${type}_${index + 1}`)}
        >
          {String(index + 1)}
        </button>
      ))}
    </div>
  );
}

export default function Sfx({ beastiedata }: { beastiedata: BeastieType }) {
  const { L } = useLocalization();

  const sfx = BEASTIE_SFX[beastiedata.id];

  const [sound, setSound] = useState("hello_1");
  const [playSound, setPlaySound] = useState("");

  const changeSound = (target: string) => {
    setSound(target);
    setPlaySound(beastiedata.id);
  };

  if (!sfx) {
    return null;
  }

  return (
    <InfoBox header={L("beastiepedia.info.voice.title")}>
      <audio
        onCanPlayThrough={(event) => {
          if (playSound == beastiedata.id) {
            event.currentTarget.play();
          }
        }}
        controls
        src={`/gameassets/audio/${beastiedata.id}/${sound}.flac`}
      />
      <TypeList
        type="hello"
        count={sfx.hello}
        currentSound={sound}
        changeSound={changeSound}
      />
      <TypeList
        type="cheer"
        count={sfx.cheer}
        currentSound={sound}
        changeSound={changeSound}
      />
      <TypeList
        type="boo"
        count={sfx.boo}
        currentSound={sound}
        changeSound={changeSound}
      />
    </InfoBox>
  );
}
