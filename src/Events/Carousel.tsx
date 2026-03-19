import { useCallback, useEffect, useRef, useState } from "react";
import InfoTabberHeader from "../shared/InfoTabber";
import styles from "./Events.module.css";
import { CarouselData, NoData } from "./Types";
import { useGameData } from "./useGameData";
import { Link } from "react-router-dom";
import useLocalization, {
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "../localization/useLocalization";

const EMOJI_MAP: Record<string, string> = {
  bigmoon: "🌙",
  experimental: "🧪",
  sadness: "🧪",
  milestone: "⏫",
  update: "⏫",
  ost: "💿",
  merch: "👕",
  fantourney: "🏆",
  tournament: "🏆",
  heatwave: "🏆",
  heatup: "🏆",
  bth: "🏆",
  print: "🗺️", // roadmap
  default: "❓",
};
const EMOJI_SWAPPED = Object.keys(EMOJI_MAP);

const EXPERIMENTAL_PREFIXES = ["experimental", "sadness"];

const AUTO_SWAP_TIME = 5000; //ms

const CAROUSEL_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTDni6WmInMS_ys4y0eH4CnAK6nS1oaZaPFTaB7FLcOgdnV67xh325Ne4tdOkh1_D8oaD-1WmRdR3kV/pub?gid=0&single=true&output=csv";

function lineSplit(text: string) {
  let count = -1;
  const regex = /("*)((?:(?!\1(?:,|$))[\w\W])+)\1?(?:,|$)/gm;
  text = text.trimEnd();
  const lines: string[][] = [];
  let matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (count == -1 && match[2].startsWith("https")) {
      count = matches.length;
      lines.push(matches);
      matches = [];
    }
    matches.push(match[2]);
    if (matches.length == count) {
      lines.push(matches);
      matches = [];
    }
  }
  return lines;
}

async function fetchCarouselData(): Promise<CarouselData> {
  const text_full = await fetch(CAROUSEL_URL).then((res) => res.text());
  // const split = text_full.split("\n");
  const lines = lineSplit(text_full);
  const datas: CarouselData = [];
  const line0 = lines[0];
  const LINK = line0.indexOf("LINK");
  const IMAGE = line0.indexOf("IMAGE");
  const lang_indexes = SUPPORTED_LANGUAGES.map((lang) =>
    line0.indexOf(LANGUAGE_NAMES[lang as SupportedLanguage]),
  );
  for (let i = 1; i < lines.length; i++) {
    const line_split = lines[i];
    const text: Record<string, string> = {};
    for (let lang_i = 0; lang_i < lang_indexes.length; lang_i++) {
      text[SUPPORTED_LANGUAGES[lang_i]] = line_split[lang_indexes[lang_i]];
    }
    datas.push({
      url: line_split[LINK],
      img: line_split[IMAGE],
      text: text,
    });
  }
  return datas;
}

export default function Carousel({
  children,
  bigmoonOld,
  bigmoonReload,
}: {
  children: React.ReactNode;
  bigmoonOld: boolean;
  bigmoonReload: () => void;
}) {
  const { L, currentLanguage } = useLocalization();

  const [carouselData, carouselReload] = useGameData<CarouselData>(
    fetchCarouselData,
    "carouselData2",
    true,
  );
  const noData =
    carouselData == NoData.WaitingForResponse || carouselData == NoData.NoData;

  const [tab, setTab] = useState(0);
  const lastReload = useRef(0);

  const [autoChangeTab, setAutoChangeTab] = useState(bigmoonOld);

  const datas = noData
    ? []
    : carouselData.filter((data) => !data.img.startsWith("bigmoon"));

  const bigmoonPos = bigmoonOld
    ? noData
      ? 1
      : datas.findIndex((data) =>
          EXPERIMENTAL_PREFIXES.some((exp) => data.img.startsWith(exp)),
        ) + 1 || 1
    : 0;

  const tabs = datas.map((data) => {
    for (const key of EMOJI_SWAPPED) {
      if (data.img.startsWith(key) || data.img.endsWith(key + ".png")) {
        return EMOJI_MAP[key];
      }
    }
    return EMOJI_MAP.default;
  });
  tabs.splice(bigmoonPos, 0, EMOJI_MAP.bigmoon);

  const tabCount = tabs.length;

  const nextTabFunction = useCallback(() => {
    if (!document.getElementById("carousel")?.matches(":hover")) {
      setTab((tab) => (tab + 1) % tabCount);
    }
  }, [tabCount]);

  useEffect(() => {
    if (autoChangeTab) {
      const interval = setInterval(nextTabFunction, AUTO_SWAP_TIME);
      return () => clearInterval(interval);
    }
  }, [autoChangeTab]);

  const parts: React.ReactNode[] = datas.map((data) => (
    <div key={data.img} className={styles.eventBlock}>
      <div className={styles.eventImage}>
        <img
          src={`https://dumbandfat.com/beastieball/${data.img}`}
          onLoad={(event) => {
            event.currentTarget.classList.remove(styles.eventImageFailed);
          }}
          onError={(event) => {
            event.currentTarget.classList.add(styles.eventImageFailed);
          }}
        />
      </div>
      <div className={styles.carouselItemText}>
        <Link to={data.url} target="_blank" rel="noopener">
          {data.text[currentLanguage] ?? data.text.en}
        </Link>
        {import.meta.env.VITE_EXPERIMENTAL != "true" &&
        EXPERIMENTAL_PREFIXES.some((exp) => data.img.startsWith(exp)) ? (
          <Link to={`https://${import.meta.env.VITE_URL_EXPERIMENTAL}/`}>
            {L("events.experimental")}
          </Link>
        ) : null}
      </div>
    </div>
  ));
  parts.splice(bigmoonPos, 0, children);

  return (
    <>
      <div id="carousel" className={styles.carouselHide}>
        <div
          className={styles.carouselRow}
          style={{ transform: `translateX(-${tab * 100}%)` }}
        >
          {parts}
        </div>
      </div>
      <div
        title={L("events.checkForUpdate")}
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
        <InfoTabberHeader
          tab={tab}
          setTab={(tab) => {
            setAutoChangeTab(false);
            setTab(tab);
          }}
          tabs={tabs}
        />
      </div>
    </>
  );
}
