import { PropsWithChildren, useMemo, useEffect, useState } from "react";
import {
  LocalizationContext,
  LocalizationType,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "./useLocalization";
import { useLocalStorage } from "usehooks-ts";

type LanguageData = Record<string, string>;

async function loadLanguageData(
  gamePromise: Promise<{ default: LanguageData }>,
  sitePromise: Promise<{ default: LanguageData }>,
) {
  const values_1 = await Promise.all([gamePromise, sitePromise]);
  return Object.assign(values_1[0].default, values_1[1].default);
}

const LANGUAGES: Record<SupportedLanguage, () => Promise<LanguageData>> = {
  en: () =>
    loadLanguageData(
      import("./languages/en/game.json"),
      import("./languages/en/site.json"),
    ),
  ru: () =>
    loadLanguageData(
      import("./languages/ru/game.json"),
      import("./languages/en/site.json"),
    ),
  "zh-CN": () =>
    loadLanguageData(
      import("./languages/zh-CN/game.json"),
      import("./languages/en/site.json"),
    ),
};

const KEY_QUOTE = "¦";
const KEY_SEP = "¬";

function localize(
  languageData: LanguageData,
  key: string,
  placeholders?: Record<string, string>,
) {
  if (!placeholders) {
    placeholders = {};
  }
  if (key[0] == KEY_QUOTE) {
    const keyArr = key.slice(1, key.length - 1).split(KEY_SEP);
    key = keyArr[0];
    for (let i = 1; i < keyArr.length; i += 2) {
      placeholders[keyArr[i]] = keyArr[i + 1].replace(/¦.+?¦/g, (match) =>
        localize(languageData, match),
      );
    }
  }

  return (key in languageData ? languageData[key] : key).replace(
    /\{(.+?)\}/g,
    (match, g1) => placeholders[g1] ?? match,
  );
}

export default function LocalizationProvider(props: PropsWithChildren) {
  const [lang, setLang] = useLocalStorage<SupportedLanguage>(
    "language",
    (navigator.languages.find((lang) => lang in LANGUAGES) ??
      "en") as SupportedLanguage,
    {
      serializer: String,
      deserializer: (value) =>
        (value in LANGUAGES ? value : "en") as SupportedLanguage,
    },
  );
  console.log(lang, localStorage.getItem("language"));

  const [languageData, setLanguageData] = useState<LanguageData | undefined>(
    undefined,
  );

  useEffect(() => {
    LANGUAGES[lang]().then((data) => setLanguageData(data));
  }, [lang]);

  const contextValue = useMemo<LocalizationType>(
    () => ({
      L: (key, placeholders) =>
        (languageData && localize(languageData, key, placeholders)) ?? key,
      languages: SUPPORTED_LANGUAGES,
      currentLanguage: lang,
      anyLanguageLoaded: !!languageData,
      setLanguage: setLang,
    }),
    [lang, languageData, setLang],
  );

  return (
    <LocalizationContext.Provider value={contextValue}>
      {props.children}
    </LocalizationContext.Provider>
  );
}
