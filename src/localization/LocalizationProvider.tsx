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
import PageNotFound from "../PageNotFound";
import {
  LANGUAGE_LOADERS,
  LanguageData,
  LocalizationExtension,
} from "./LanguageLoaders";

declare global {
  interface Window {
    Localization: LocalizationType;
  }
}

const BEASTIE_NAMES: Record<
  string,
  Record<SupportedLanguage, string>
> = BEASTIE_NAMES_UNTYPED;

const KEY_QUOTE = "¦";
const KEY_SEP = "¬";

const SITE_SEP = ".";

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
  } else if (key.includes(SITE_SEP)) {
    let current: string | LanguageData = languageData;
    for (const fragment of key.split(SITE_SEP)) {
      if (typeof current == "string") {
        break;
      }
      current = current[fragment];
      if (current === undefined) {
        console.log("Loc key not found:", key);
        return key;
      }
    }
    // return key;
    return (typeof current == "string" ? current : key).replace(
      /\{(.+?)\}/g,
      (match, g1) => placeholders[g1] ?? match,
    );
  }

  if (key in BEASTIE_NAMES) {
    return BEASTIE_NAMES[key][useEnName ? "en" : lang];
  }
  const str = languageData[key] as string;
  if (str === undefined) {
    console.log("Loc key not found:", key);
  }

  return placeholders_exist
    ? (str !== undefined ? str : key).replace(
        /\{(.+?)\}/g,
        (match, g1) => placeholders[g1] ?? match,
      )
    : str !== undefined
      ? str
      : key;
}

function isObject(obj: unknown) {
  return obj && typeof obj == "object" && !Array.isArray(obj);
}

function merge(obj1: Record<string, any>, obj2: Record<string, any>) {
  const new_obj: Record<string, any> = {};
  for (const key in obj1) {
    new_obj[key] = obj1[key];
  }
  for (const key in obj2) {
    if (key in new_obj && isObject(new_obj[key])) {
      if (isObject(obj2[key])) {
        new_obj[key] = merge(new_obj[key], obj2[key]);
      }
    } else {
      new_obj[key] = obj2[key];
    }
  }
  return new_obj;
}

export default function LocalizationProvider({
  children,
  localizationExtensions,
}: PropsWithChildren & { localizationExtensions: LocalizationExtension[] }) {
  const { lang: paramLang } = useParams();

  const [storedLang, setStoredLang] = useLocalStorage<SupportedLanguage>(
    "language",
    ((paramLang && paramLang in LANGUAGE_LOADERS ? paramLang : undefined) ??
      navigator.languages.find((lang) => lang in LANGUAGE_LOADERS) ??
      "en") as SupportedLanguage,
    {
      serializer: String,
      deserializer: (value) =>
        (value in LANGUAGE_LOADERS.game ? value : "en") as SupportedLanguage,
    },
  );

  // const [autoNavigateLang] = useLocalStorage("autoNavigateLang", false);

  const navigate = useNavigate();

  const setParamLang = useCallback(
    (lang: SupportedLanguage) => {
      const prefix = lang == "en" ? "/" : `/${lang}/`;
      const path = location.pathname;
      const noParamLang =
        !paramLang || !paramLang.split("-").every((code) => code.length == 2);
      let currentPrefix = noParamLang ? "/" : `/${paramLang}/`;
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
    if (paramLang != storedLang || paramLang == "en") {
      setParamLang(storedLang);
    }
  }, [storedLang, paramLang, setParamLang]);

  const lang: SupportedLanguage = storedLang;

  const [languageExtensionsData, setLanguageExtensionsData] = useState<
    Partial<
      Record<
        LocalizationExtension,
        { lang: SupportedLanguage; data: LanguageData }
      >
    >
  >({});

  const languageData = useMemo(
    () =>
      Object.values(languageExtensionsData).reduce(
        (accum, ext) => merge(accum, ext.data),
        {},
      ),
    [languageExtensionsData],
  );
  const allLanguageExtensionsLoaded = useMemo(() => {
    for (const ext of localizationExtensions)
      if (!languageExtensionsData[ext]) return false;
    return true;
  }, [lang, languageExtensionsData]);

  useEffect(() => {
    for (const ext of localizationExtensions) {
      const ext_data = languageExtensionsData[ext];
      const loaders = LANGUAGE_LOADERS[ext];
      const languageToLoad = lang in loaders ? lang : "en";
      const loader = loaders[languageToLoad] as () => Promise<LanguageData>;
      if (!ext_data || ext_data.lang != languageToLoad)
        loader().then((data) =>
          setLanguageExtensionsData((languageExtensionsData) => ({
            ...languageExtensionsData,
            [ext]: { lang: languageToLoad, data: data.default },
          })),
        );
    }
  }, [lang]);
  console.log(localizationExtensions, languageExtensionsData);

  const contextValue = useMemo<LocalizationType>(
    () => ({
      L: (key, placeholders, useEnName) =>
        localize(lang, languageData ?? {}, key, placeholders, useEnName),
      languages: SUPPORTED_LANGUAGES,
      currentLanguage: lang,
      anyLanguageLoaded: allLanguageExtensionsLoaded,
      setLanguage: setLang,
      getLink: (path) => (lang == "en" ? path : `/${lang}${path}`),
      beastieNames: BEASTIE_NAMES,
    }),
    [lang, languageData, setLang],
  );
  window.Localization = contextValue;

  if (!allLanguageExtensionsLoaded) {
    return <Loading />;
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      {paramLang?.length &&
      !location.pathname.startsWith(`/${paramLang}/`) &&
      !SUPPORTED_LANGUAGES.includes(
        (paramLang ?? "en") as SupportedLanguage,
      ) ? (
        <PageNotFound />
      ) : (
        children
      )}
    </LocalizationContext.Provider>
  );
}
