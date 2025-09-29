import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { writeFile, createWriteStream } from "fs";
import { LinkItem, SitemapStream } from "sitemap";

type SupportedLanguage = "en" | "ru" | "zh-CN";
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "ru", "zh-CN"];

import beastie_data from "./src/data/raw/beastie_data.json";
const BEASTIE_DATA: Record<string, { name: string }> = beastie_data;
import beastie_names from "./src/localization/beastie_names.json";
const BEASTIE_NAMES: Record<
  string,
  Record<SupportedLanguage, string>
> = beastie_names;

function generateSitemap(url: string) {
  const beasties: ((lang: SupportedLanguage) => string)[] = Object.keys(
    BEASTIE_DATA,
  ).map(
    (id) => (lang) =>
      `beastiepedia/${BEASTIE_NAMES[BEASTIE_DATA[id].name.slice(1, BEASTIE_DATA[id].name.length - 1)][lang]}`,
  );
  const paths: (string | ((lang: SupportedLanguage) => string))[] = [
    "",
    "beastiepedia/",
    ...beasties,
    "playdex/",
    "map/",
    "team/viewer/",
    "team/builder/",
  ];
  const sitemap = new SitemapStream({ hostname: url });
  const writeStream = createWriteStream("dist/sitemap.xml");
  sitemap.pipe(writeStream);
  for (const lang of SUPPORTED_LANGUAGES) {
    for (const path of paths) {
      const links: LinkItem[] = [];
      for (const lang2 of SUPPORTED_LANGUAGES) {
        links.push({
          lang: lang2,
          url:
            (lang2 == "en" ? "/" : `/${lang2}/`) +
            (typeof path == "function" ? path(lang2) : path),
        });
      }
      sitemap.write({
        url:
          (lang == "en" ? "/" : `/${lang}/`) +
          (typeof path == "function" ? path(lang) : path),
        links: links,
      });
    }
  }
  sitemap.end();
  writeFile("dist/robots.txt", `Sitemap: ${url}/sitemap.txt`, () => {});
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv("mock", process.cwd(), "");
  const url = env.VITE_URL != "" ? env.VITE_URL : "https://beastieball.info";
  return {
    build: { sourcemap: true },
    plugins: [
      react(),
      {
        name: "Sitemap",
        closeBundle() {
          if (process.env.VITE_EXPERIMENTAL == "true") return;
          generateSitemap(url);
        },
      },
    ],
  };
});
