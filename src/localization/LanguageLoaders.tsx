import { SupportedLanguage } from "./useLocalization";

export type LanguageData = { [key: string]: LanguageData | string };

export type LocalizationExtension =
  | "game"
  | "site"
  | "encounters"
  | "site_encounters"
  | "workshop";

export const LANGUAGE_LOADERS: Record<
  LocalizationExtension,
  Partial<Record<SupportedLanguage, () => Promise<LanguageData>>>
> = {
  game: {
    en: () => import("./languages/en/game.json"),
    ru: () => import("./languages/ru/game.json"),
    "zh-CN": () => import("./languages/zh-CN/game.json"),
    es: () => import("./languages/es/game.json"),
    "pt-BR": () => import("./languages/pt-BR/game.json"),
  },
  site: {
    en: () => import("./languages/en/site.json"),
  },
  site_encounters: {
    en: () => import("./languages/en/site_encounters.json"),
  },
  encounters: {
    en: () => import("./languages/en/encounters.json"),
    ru: () => import("./languages/ru/encounters.json"),
    "zh-CN": () => import("./languages/zh-CN/encounters.json"),
    es: () => import("./languages/es/encounters.json"),
    "pt-BR": () => import("./languages/pt-BR/encounters.json"),
  },
  workshop: {
    en: () => import("./languages/en/workshop.json"),
  },
};
