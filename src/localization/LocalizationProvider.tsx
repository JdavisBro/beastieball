import {
  useMemo,
  useEffect,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { useNavigate, useParams } from "react-router-dom";

import {
  LocalizationContext,
  LocalizationType,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "./useLocalization";
import BEASTIE_NAMES_UNTYPED from "./beastie_names.json";
import Loading from "../Loading";

const BEASTIE_NAMES: Record<
  string,
  Record<SupportedLanguage, string>
> = BEASTIE_NAMES_UNTYPED;

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
  lang: SupportedLanguage,
  languageData: LanguageData,
  key: string,
  placeholders?: Record<string, string>,
  useEnName?: boolean,
) {
  let placeholders_exist = true;
  if (!placeholders) {
    placeholders_exist = false;
    placeholders = {};
  }
  if (key[0] == KEY_QUOTE) {
    const keyArr = key.slice(1, key.length - 1).split(KEY_SEP);
    key = keyArr[0];
    if (keyArr.length > 1) {
      placeholders_exist = true;
    }
    for (let i = 1; i < keyArr.length; i += 2) {
      placeholders[keyArr[i]] = keyArr[i + 1].replace(/¦.+?¦/g, (match) =>
        localize(lang, languageData, match),
      );
    }
  }

  if (key in BEASTIE_NAMES) {
    return BEASTIE_NAMES[key][useEnName ? "en" : lang];
  }

  return placeholders_exist
    ? (key in languageData ? languageData[key] : key).replace(
        /\{(.+?)\}/g,
        (match, g1) => placeholders[g1] ?? match,
      )
    : key in languageData
      ? languageData[key]
      : key;
}

export default function LocalizationProvider({ children }: PropsWithChildren) {
  const { lang: paramLang } = useParams();

  const [storedLang, setStoredLang] = useLocalStorage<SupportedLanguage>(
    "language",
    ((paramLang && paramLang in LANGUAGES ? paramLang : undefined) ??
      navigator.languages.find((lang) => lang in LANGUAGES) ??
      "en") as SupportedLanguage,
    {
      serializer: String,
      deserializer: (value) =>
        (value in LANGUAGES ? value : "en") as SupportedLanguage,
    },
  );

  // const [autoNavigateLang] = useLocalStorage("autoNavigateLang", false);

  const navigate = useNavigate();

  const setParamLang = useCallback(
    (lang: SupportedLanguage) => {
      const prefix = lang == "en" ? "/" : `/${lang}/`;
      const path = location.pathname;
      let currentPrefix =
        !paramLang || paramLang == "en" ? "/" : `/${paramLang}/`;
      for (const supportedLang of SUPPORTED_LANGUAGES) {
        if (path.startsWith(`/${supportedLang}/`)) {
          currentPrefix = `/${supportedLang}/`;
        }
      }
      if (prefix == currentPrefix) {
        return;
      }
      navigate(
        {
          pathname: path.replace(currentPrefix, prefix),
          hash: location.hash,
        },
        { replace: true },
      );
    },
    [navigate, paramLang],
  );

  const setLang = useCallback(
    (lang: SupportedLanguage) => {
      setStoredLang(lang);
      setParamLang(lang);
    },
    [setParamLang, setStoredLang],
  );

  useEffect(() => {
    if (paramLang != storedLang) {
      setParamLang(storedLang);
    }
  }, [storedLang, paramLang, setParamLang]);

  const lang: SupportedLanguage = storedLang;

  const [languageData, setLanguageData] = useState<LanguageData | undefined>(
    undefined,
  );

  useEffect(() => {
    LANGUAGES[lang]().then((data) => {
      setLanguageData(data);
      document.documentElement.lang = lang;
    });
  }, [lang]);

  const contextValue = useMemo<LocalizationType>(
    () => ({
      L: (key, placeholders, useEnName) =>
        localize(lang, languageData ?? {}, key, placeholders, useEnName),
      languages: SUPPORTED_LANGUAGES,
      currentLanguage: lang,
      anyLanguageLoaded: !!languageData,
      setLanguage: setLang,
      getLink: (path) => (lang == "en" ? path : `/${lang}${path}`),
      beastieNames: BEASTIE_NAMES,
    }),
    [lang, languageData, setLang],
  );

  if (!languageData) {
    return <Loading />;
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}
