import { useContext } from "react";
import { createContext } from "react";

export type SupportedLanguage = "en" | "ru" | "zh-CN";
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "ru", "zh-CN"];
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  ru: "Русский",
  "zh-CN": "简体中文",
};

export type LocalizationFunction = (
  key: string,
  placeholders?: Record<string, string>,
) => string;

export type LocalizationType = {
  L: LocalizationFunction;
  languages: SupportedLanguage[];
  currentLanguage: SupportedLanguage;
  anyLanguageLoaded: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  getLink: (path: string) => string;
};

export const LocalizationContext = createContext<LocalizationType>({
  L: (key) => key,
  languages: SUPPORTED_LANGUAGES,
  currentLanguage:
    (navigator.languages.find((lang) =>
      SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage),
    ) as SupportedLanguage) ?? "en",
  anyLanguageLoaded: false,
  setLanguage: () => {},
  getLink: (path) => path,
});

export default function useLocalization() {
  return useContext(LocalizationContext);
}
