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
  LanguageExtensionData,
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

const USE_LOWER_CASE_PATHS = true; // for netlify that redirects upper to lower case always for file paths

const BEASTIE_NAMES: Record<
  string,
  Record<SupportedLanguage, string>
> = BEASTIE_NAMES_UNTYPED;

const KEY_QUOTE = "¦";
const KEY_SEP = "¬";

const SITE_SEP = ".";

function doPlural(text: string, placeholders: Record<string, string>) {
  if (!text.startsWith("{p:")) return undefined;
  const [, input, notplural, plural] =
    /{p:(.+?),(.+?),(.+?)}/g.exec(text) ?? [];
  if (!notplural || !plural) return notplural || plural;
  const inputNumber = Number(
    input.startsWith("{")
      ? (placeholders[input.slice(1, input.length - 1)] ?? "0")
      : input,
  );
  if (inputNumber == 1) return notplural;
  return plural;
}

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
      /\{(?:p:.+?,.+?|(.+?))\}/g,
      (match, g1) =>
        (g1 ? placeholders[g1] : doPlural(match, placeholders)) ?? match,
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
        /\{(?:p:.+?,.+?|(.+?))\}/g,
        (match, g1) =>
          (g1 ? placeholders[g1] : doPlural(match, placeholders)) ?? match,
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

function findSupportedLang(lang: string) {
  lang = lang.toLowerCase();
  return SUPPORTED_LANGUAGES.find(
    (supportedLang) => lang == supportedLang.toLowerCase(),
  );
}

export default function LocalizationProvider({
  children,
  localizationExtensions,
}: PropsWithChildren & { localizationExtensions: LocalizationExtension[] }) {
  const { lang: paramLang } = useParams();

  const [storedLang, setStoredLang] = useLocalStorage<SupportedLanguage>(
    "language",
    ((paramLang ? findSupportedLang(paramLang) : undefined) ??
      navigator.languages.find((lang) => findSupportedLang(lang)) ??
      "en") as SupportedLanguage,
    {
      serializer: String,
      deserializer: (value) =>
        (findSupportedLang(value) ?? "en") as SupportedLanguage,
    },
  );

  // const [autoNavigateLang] = useLocalStorage("autoNavigateLang", false);

  const navigate = useNavigate();

  const setParamLang = useCallback(
    (lang: SupportedLanguage) => {
      const prefix =
        lang == "en"
          ? "/"
          : `/${USE_LOWER_CASE_PATHS ? lang.toLowerCase() : lang}/`;
      console.log(prefix, lang);
      const path = location.pathname;
      const noParamLang =
        !paramLang || !paramLang.split("-").every((code) => code.length == 2);
      let currentPrefix = noParamLang ? "/" : `/${paramLang}/`;
      for (const supportedLang of SUPPORTED_LANGUAGES) {
        if (path.startsWith(`/${supportedLang}/`)) {
          currentPrefix = `/${supportedLang}/`;
        } else if (path.startsWith(`/${supportedLang.toLowerCase()}/`)) {
          currentPrefix = `/${supportedLang.toLowerCase()}/`;
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

  const [languageExtensionsData, setLanguageExtensionsData] =
    useState<LanguageExtensionData>({});

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
  }, [lang, languageExtensionsData, localizationExtensions]);

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
  }, [lang, localizationExtensions]);

  const contextValue = useMemo<LocalizationType>(
    () => ({
      L: (key, placeholders, useEnName) =>
        localize(lang, languageData ?? {}, key, placeholders, useEnName),
      languages: SUPPORTED_LANGUAGES,
      currentLanguage: lang,
      anyLanguageLoaded: allLanguageExtensionsLoaded,
      languageExtensionData: languageExtensionsData,
      setLanguage: setLang,
      getLink: (path) =>
        lang == "en"
          ? path
          : `/${USE_LOWER_CASE_PATHS ? lang.toLowerCase() : lang}${path}`,
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
      !findSupportedLang(paramLang ?? "en") ? (
        <PageNotFound />
      ) : (
        children
      )}
    </LocalizationContext.Provider>
  );
}
