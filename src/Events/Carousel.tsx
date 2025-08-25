import { useRef, useState } from "react";
import InfoTabberHeader from "../shared/InfoTabber";
import styles from "./Events.module.css";
import { CarouselData, NoData } from "./Types";
import { useGameData } from "./useGameData";
import { Link } from "react-router-dom";

const EMOJI_MAP: Record<string, string> = {
  bigmoon: "🌙",
  milestone: "⏫",
  update: "⏫",
  ost: "💿",
  merch: "👕",
  tournament: "🏆",
  heatwave: "🏆",
  heatup: "🏆",
  experimental: "🧪",
  default: "❓",
};
const EMOJI_SWAPPED = Object.keys(EMOJI_MAP);

const LANG_MAP: Record<string, string> = {
  English: "en",
  Русский: "ru",
  简体中文: "zh-CN",
};

function findLanguageText(text: string[], langs: string[]) {
  for (const lang of navigator.languages) {
    for (let i = 0; i < langs.length; i++) {
      const lang_code = LANG_MAP[langs[i]];
      if (!lang_code) {
        console.log("MISSING LANG", langs[i]);
        continue;
      }
      if (lang.startsWith(lang_code)) {
        return text[i];
      }
    }
  }
  return text[0];
}

export default function Carousel({
  children,
  bigmoonReload,
}: {
  children: React.ReactNode;
  bigmoonReload: () => void;
}) {
  const [carouselData, carouselReload] = useGameData<CarouselData>(
    "carousel",
    "carouselData",
    true,
  );
  const noData =
    carouselData == NoData.WaitingForResponse || carouselData == NoData.NoData;

  const [tab, setTab] = useState(0);
  const lastReload = useRef(0);

  const datas = noData
    ? []
    : carouselData.data.filter((data) => !data.img.startsWith("bigmoon"));

  const tabs = [
    EMOJI_MAP.bigmoon,
    ...datas.map((data) => {
      for (const key of EMOJI_SWAPPED) {
        if (data.img.startsWith(key) || data.img.endsWith(key + ".png")) {
          return EMOJI_MAP[key];
        }
      }
      return EMOJI_MAP.default;
    }),
  ];

  return (
    <>
      <div className={styles.carouselHide}>
        <div
          className={styles.carouselRow}
          style={{ transform: `translateX(-${tab * 100}%)` }}
        >
          {children}
          {datas.map((data) => (
            <div key={data.img} className={styles.eventBlock}>
              <div className={styles.eventImage}>
                <img
                  src={`https://dumbandfat.com/beastieball/${data.img}`}
                  onLoad={(event) => {
                    event.currentTarget.classList.remove(
                      styles.eventImageFailed,
                    );
                  }}
                  onError={(event) => {
                    event.currentTarget.classList.add(styles.eventImageFailed);
                  }}
                />
              </div>
              <Link
                className={styles.carouselItemText}
                to={data.url}
                target="_blank"
                rel="noopener"
              >
                <div className={styles.carouselItemText}>
                  {findLanguageText(data.text, data.langs)}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div
        title="Check for Update"
        className={styles.eventReloadButton}
        onClick={(event) => {
          if (Date.now() < lastReload.current + 10000) {
            return;
          }
          lastReload.current = Date.now();
          bigmoonReload();
          carouselReload();
          const target = event.currentTarget;
          target.classList.add(styles.reloadButtonSpin);
          setTimeout(() => {
            if (target) {
              target.classList.remove(styles.reloadButtonSpin);
            }
          }, 10000);
        }}
      >
        ⟳
      </div>
      <div className={styles.tabber}>
        <InfoTabberHeader tab={tab} setTab={setTab} tabs={tabs} />
      </div>
    </>
  );
}
