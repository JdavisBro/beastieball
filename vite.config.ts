import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {
  writeFile,
  createWriteStream,
  readFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { LinkItem, SitemapStream } from "sitemap";

type SupportedLanguage = "en" | "ru" | "zh-CN" | "es";
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "ru", "zh-CN", "es"];

import loc from "./src/localization/languages/en/site.json";
type LanguageData = { [key: string]: LanguageData | string };
const LOC: LanguageData = loc;

import beastie_data from "./src/data/raw/beastie_data.json";
const BEASTIE_DATA: Record<string, { name: string; desc: string }> =
  beastie_data;
import beastie_names from "./src/localization/beastie_names.json";
const BEASTIE_NAMES: Record<
  string,
  Record<SupportedLanguage, string>
> = beastie_names;

type PrerenderPage = {
  name: string;
  description: string;
  image: string;
  path: string;
  useBranding?: boolean;
  isDirectory?: boolean;
  noLoc?: boolean;
};

const PRERENDER_PAGES: PrerenderPage[] = [
  {
    name: process.env.SITE_BRANDING ?? "Beastieball.info",
    description: "common.description",
    image: "/ball.png",
    path: "/",
  },
  {
    name: "notFound.title",
    description: "common.description",
    useBranding: true,
    image: "/ball.png",
    path: "/404",
  },
  {
    name: "beastiepedia.title",
    description: "beastiepedia.description",
    image: "/gameassets/sprMainmenu/0.png",
    path: "/beastiepedia/",
  },
  {
    name: "playdex.title",
    description: "playdex.description",
    useBranding: true,
    image: "/gameassets/sprMainmenu/6.png",
    path: "/playdex/",
  },
  {
    name: "map.title",
    description: "map.description",
    useBranding: true,
    image: "gameassets/sprMainmenu/3.png",
    path: "/map/",
  },
  {
    name: "teams.title",
    description: "teams.description",
    useBranding: true,
    image: "gameassets/sprMainmenu/20.png",
    path: "/team/",
  },
  {
    name: "teams.viewer.title",
    description: "teams.viewer.description",
    useBranding: true,
    image: "gameassets/sprMainmenu/8.png",
    path: "/team/viewer/",
  },
  {
    name: "teams.builder.title",
    description: "teams.builder.description",
    useBranding: true,
    image: "gameassets/sprMainmenu/18.png",
    path: "/team/builder/",
  },
  {
    name: "teams.encounters.title",
    description: "teams.encounters.description",
    useBranding: true,
    image: "gameassets/sprMainmenu/27.png",
    path: "/team/encounters/",
  },
];

function getSiteLoc(
  loc: LanguageData,
  key: string,
  placeholders?: Record<string, string>,
) {
  let current: string | LanguageData = loc;
  for (const fragment of key.split(".")) {
    if (typeof current == "string") {
      break;
    }
    current = current[fragment];
    if (current === undefined) {
      console.log("Loc key not found:", key);
      return key;
    }
  }
  const value = typeof current == "string" ? current : key;
  return placeholders
    ? value.replace(/\{(.+?)\}/g, (match, g1) => placeholders[g1] ?? match)
    : value;
}

function generateSitemap(url: string) {
  const beasties: ((lang: SupportedLanguage) => string)[] = Object.keys(
    BEASTIE_DATA,
  ).map(
    (id) => (lang) =>
      `beastiepedia/${BEASTIE_NAMES[BEASTIE_DATA[id].name.slice(1, BEASTIE_DATA[id].name.length - 1)][lang]}`,
  );

  let redirect_rules = "";
  const indexHtml = readFileSync("dist/index.html").toString();
  const branding = process.env.VITE_BRANDING ?? "Beastieball.info";
  for (const lang of SUPPORTED_LANGUAGES) {
    const game_loc: Record<string, string> = JSON.parse(
      readFileSync(`src/localization/languages/${lang}/game.json`).toString(),
    );
    const lang_site = existsSync(
      `src/localization/languages/${lang}/site.json`,
    );
    const site_loc: LanguageData = JSON.parse(
      readFileSync(
        `src/localization/languages/${lang_site ? lang : "en"}/site.json`,
      ).toString(),
    );
    const prerender_pages: PrerenderPage[] = [
      ...PRERENDER_PAGES,
      ...Object.values(BEASTIE_DATA).map((beastie) => {
        const name_key = beastie.name.slice(1, beastie.name.length - 1);
        const name = BEASTIE_NAMES[name_key][lang];
        redirect_rules += `/beastiepedia/${name} /beastiepedia/${name}.html 200\n`;
        return {
          name: getSiteLoc(site_loc, "beastiepedia.titleBeastie", {
            beastie: name,
          }),
          description:
            game_loc[beastie.desc.slice(1, beastie.desc.length - 1)] ?? "??",
          image: `/icons/${BEASTIE_NAMES[name_key].en}.png`,
          path: `/beastiepedia/${name}`,
          noLoc: true,
        };
      }),
    ];
    const redirect_rules_in = readFileSync("dist/_redirects").toString();
    writeFile(
      "dist/_redirects",
      redirect_rules_in.replace("# INSERT", redirect_rules),
      () => {},
    );
    const pathPrefix = lang == "en" ? "" : `/${lang}`;
    for (const page of prerender_pages) {
      const title = page.noLoc ? page.name : getSiteLoc(site_loc, page.name);
      const placeholders: Record<string, string> = {
        TITLE: page.useBranding
          ? getSiteLoc(site_loc, "common.title", { page: title, branding })
          : title,
        DESCRIPTION: page.noLoc
          ? page.description
          : getSiteLoc(site_loc, page.description),
        IMAGE: page.image,
        PATH: pathPrefix + page.path,
      };
      const html = indexHtml.replace(
        /\{\{([A-Z]+?)\}\}/g,
        (match, g1) => placeholders[g1] ?? match,
      );
      const dir = page.path.endsWith("/");
      if (dir) mkdirSync(`dist${pathPrefix}${page.path}`, { recursive: true });
      const path = `dist${pathPrefix}${page.path}${dir ? "index" : ""}.html`;
      writeFile(path, html, () => {});
    }
  }

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
  writeFile("dist/robots.txt", `Sitemap: ${url}/sitemap.xml`, () => {});
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
