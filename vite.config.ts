import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as fs from "fs";

import beastie_data from "./src/data/raw/beastie_data.json";

const BEASTIE_DATA: Record<string, { name: string }> = beastie_data;

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
          const beasties: string[] = Object.keys(BEASTIE_DATA).map(
            (id) => `${url}/beastiepedia/${BEASTIE_DATA[id].name}`,
          );
          const sitemap = `${url}/
${url}/beastiepedia/
${beasties.join("\n")}
${url}/playdex/
${url}/map/
${url}/teams/`;
          fs.writeFile("dist/sitemap.txt", sitemap, () => {});
          fs.writeFile(
            "dist/robots.txt",
            `Sitemap: ${url}/sitemap.txt`,
            () => {},
          );
        },
      },
    ],
  };
});
