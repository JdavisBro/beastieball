import abilities from "../data/abilities";
import BEASTIE_DATA from "../data/BeastieData";
import MOVE_DIC from "../data/MoveData";

import type { BBox } from "../data/SpriteInfo";
import { TypeData } from "../data/TypeColor";
import type { RenderBeastieType } from "../shared/beastieRender/BeastieRenderContext";
import type { TeamBeastie } from "./Types";

const BEASTIE_SIZE = [370, 272];
const BEASTIE_GAP = 8;
const BEASTIE_IMAGE = BEASTIE_SIZE[0] / 2.15;
const BEASTIE_IMAGE_OFFSET = (BEASTIE_SIZE[0] / 2 - BEASTIE_IMAGE) / 2;

const BEASTIE_STAT_HEIGHT = 125;
const BEASTIE_STAT_ICON = 31;
const BEASTIE_STAT_BAR = 46;
const BEASTIE_STAT_BAR_HEIGHT = 34;
const BEASTIE_STAT_TEXT_OFFSET = navigator.userAgent.includes("Chrome/")
  ? 24
  : 22;

const BEASTIE_PLAY_BEGIN = BEASTIE_SIZE[1] - 40;
const BEASTIE_PLAY_SIZE = [98, 36];
const BEASTIE_PLAY_BLOCK = 20;
const BEASTIE_PLAY_GAP = 19;

export enum DrawMode {
  Horizontal,
  Vertical,
  VGrid,
}

const MODE_POS = [
  [
    [0, 0],
    [BEASTIE_SIZE[0] + BEASTIE_GAP, 0],
    [(BEASTIE_SIZE[0] + BEASTIE_GAP) * 2, 0],
    [(BEASTIE_SIZE[0] + BEASTIE_GAP) * 3, 0],
    [(BEASTIE_SIZE[0] + BEASTIE_GAP) * 4, 0],
  ],
  [
    [0, 0],
    [0, BEASTIE_SIZE[1] + BEASTIE_GAP],
    [0, (BEASTIE_SIZE[1] + BEASTIE_GAP) * 2],
    [0, (BEASTIE_SIZE[1] + BEASTIE_GAP) * 3],
    [0, (BEASTIE_SIZE[1] + BEASTIE_GAP) * 4],
  ],
  [
    [0, 0],
    [BEASTIE_SIZE[0] + BEASTIE_GAP, 0],
    [0, BEASTIE_SIZE[1] + BEASTIE_GAP],
    [BEASTIE_SIZE[0] + BEASTIE_GAP, BEASTIE_SIZE[1] + BEASTIE_GAP],
    [
      (BEASTIE_SIZE[0] + BEASTIE_GAP) * 0.5,
      (BEASTIE_SIZE[1] + BEASTIE_GAP) * 2,
    ],
  ],
];

const POS_VGRID_3_CENTER = [
  (BEASTIE_SIZE[0] + BEASTIE_GAP) * 0.5,
  BEASTIE_SIZE[1] + BEASTIE_GAP,
];

const BEASITE_COLORS = ["#ddd1bd", "#d5c9b5"];
const BAR_COLORS = ["#232323", "#1c1c1c"];
const COLOR_HEIGHT = 4;

function getSize(mode: DrawMode, count: number) {
  switch (mode) {
    case DrawMode.Horizontal:
      return [
        BEASTIE_SIZE[0] * count + BEASTIE_GAP * (count - 1),
        BEASTIE_SIZE[1],
      ];
    case DrawMode.Vertical:
      return [
        BEASTIE_SIZE[0],
        BEASTIE_SIZE[1] * count + BEASTIE_GAP * (count - 1),
      ];
    case DrawMode.VGrid: {
      switch (count) {
        case 0:
          return [1, 1];
        case 1:
          return BEASTIE_SIZE;
        default:
          return [
            BEASTIE_SIZE[0] * 2 + BEASTIE_GAP,
            BEASTIE_SIZE[1] * Math.ceil(count / 2) +
              BEASTIE_GAP * Math.ceil(count / 2 - 1),
          ];
      }
    }
  }
}

export function createTeamImageCanvas(
  canvas: HTMLCanvasElement,
  team: TeamBeastie[],
  mode: DrawMode,
  beastieRender: (
    beastie: RenderBeastieType,
  ) => Promise<[HTMLCanvasElement, BBox | null] | null>,
  atLevel?: number,
  maxCoaching?: boolean,
  copy?: boolean,
) {
  const size = getSize(mode, team.length);
  if (
    !(
      document.fonts.check("16px 'Go Banana'") &&
      document.fonts.check("16px SportsJersey")
    )
  ) {
    throw new Error("Missing Fonts");
  }
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No Context");
  }
  createTeamImage(
    ctx,
    team,
    mode,
    beastieRender,
    loadImageCanvas,
    atLevel,
    maxCoaching,
  )
    .catch((reason) => console.log(reason))
    .then(() => {
      if (copy) {
        canvas.toBlob((blob) => {
          if (!blob) {
            return;
          }
          navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        }, "image/png");
      } else {
        const a = document.createElement("a");
        a.download = `team.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      }
    });
}

function loadImageCanvas(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = document.createElement("img");
    image.src = src;
    image.onerror = () => reject();
    image.onload = () => resolve(image);
  });
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color1: string,
  color2: string,
) {
  ctx.fillStyle = color1;
  ctx.fillRect(x, y, width, height);
  const end = y + height;
  ctx.fillStyle = color2;
  ctx.beginPath();
  for (let i = y + COLOR_HEIGHT; i < end; i += COLOR_HEIGHT * 2) {
    ctx.rect(x, i, width, i + COLOR_HEIGHT > end ? end - i : COLOR_HEIGHT);
  }
  ctx.fill();
}

function splitText(
  text: string,
  ctx: CanvasRenderingContext2D,
  max_width: number,
  loadImage: (src: string) => Promise<HTMLImageElement>,
): [string[], { x: number; line: number; image: Promise<HTMLImageElement> }[]] {
  const lines = [""];
  const images: {
    line: number;
    index: number;
    image: Promise<HTMLImageElement>;
  }[] = [];
  let tagging = false;
  let valuing = false;
  let tag = "";
  let value = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let newchar = char;
    switch (char) {
      case "[":
        if (tagging && tag == "") {
          tagging = false;
        } else {
          newchar = "";
          tagging = true;
          valuing = false;
          tag = "";
          value = "";
        }
        break;
      case ",":
        if (tagging) {
          valuing = true;
          newchar = "";
        }
        break;
      case "]":
        if (tagging) {
          if (!tag.startsWith("spr")) {
            console.log("NON SPR TAG", tag, value);
          }
          tagging = false;
          newchar = "　";
          images.push({
            line: lines.length - 1,
            index: lines[lines.length - 1].length,
            image: loadImage(`/gameassets/${tag}/${value}.png`),
          });
        }
        break;
      case " ":
        if (
          ctx.measureText(
            lines[lines.length - 1] +
              newchar +
              text
                .slice(i, text.indexOf(" ", i + 1))
                .replace(/\|/, "")
                .replace(/\[[^[]+?]/, "　"),
          ).width > max_width
        ) {
          lines.push("");
          newchar = "";
        }
    }
    if (newchar) {
      if (tagging) {
        if (valuing) {
          value += newchar;
        } else {
          tag += newchar;
        }
      } else {
        lines[lines.length - 1] = lines[lines.length - 1] + newchar;
      }
    }
  }
  return [
    lines,
    images.map((img) => ({
      x:
        -(ctx.measureText(lines[img.line]).width / 2) +
        ctx.measureText(lines[img.line].slice(0, img.index)).width,
      line: img.line,
      image: img.image,
    })),
  ];
}

function round5Ceil(num: number) {
  return Math.ceil(Math.round(num * 100000) / 100000);
}

function statCalc(
  base_stat: number,
  level: number,
  coaching: number,
  training: number,
) {
  return (
    5 +
    round5Ceil(
      (base_stat + Math.floor(training / 4)) *
        (level / 50) *
        (0.7 + 0.3 * coaching),
    )
  );
}
const REGULAR_FONT = "17.6px 'Go Banana'";
const NUMBER_FONT = "11px SportsJersey";
const SMALLTEXT_FONT = "15.84px 'Go Banana'";

const altMap: { [key: number]: "colors" | "shiny" | "colors2" } = {
  1: "colors",
  2: "shiny",
  3: "colors2",
};

async function createTeamImage(
  ctx: CanvasRenderingContext2D,
  team: TeamBeastie[],
  mode: DrawMode,
  beastieRender: (
    beastie: RenderBeastieType,
  ) => Promise<[HTMLCanvasElement, BBox | null] | null>,
  loadImage: (src: string) => Promise<HTMLImageElement>,
  atLevel?: number,
  maxCoaching?: boolean,
) {
  const typeImages = [];
  for (let i = 0; i < 6; i++) {
    typeImages.push(await loadImage(`/gameassets/sprType/${i}.png`));
  }

  for (let i = 0; i < 5; i++) {
    const beastie = team[i];
    const beastiedata = beastie ? BEASTIE_DATA.get(beastie.specie) : undefined;
    if (beastie && beastiedata) {
      const [startx, starty] =
        mode == DrawMode.VGrid && team.length == 3 && i == 2
          ? POS_VGRID_3_CENTER
          : MODE_POS[mode][i];
      drawLines(
        ctx,
        startx,
        starty,
        BEASTIE_SIZE[0],
        BEASTIE_SIZE[1],
        BEASITE_COLORS[0],
        BEASITE_COLORS[1],
      );
      ctx.letterSpacing = "1px";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.font = REGULAR_FONT;
      const num_text = `#${beastie.number}`;
      const level = atLevel
        ? atLevel
        : Math.floor(Math.cbrt(Math.ceil(beastie.xp / beastiedata.growth)));
      const level_text = ` Lvl ${level}`;

      const display_name = beastie.name || beastiedata.name;
      const name_width = ctx.measureText(display_name).width;
      const level_width = ctx.measureText(level_text).width;
      ctx.font = NUMBER_FONT;
      const num_width = ctx.measureText(num_text).width;
      const start_offset =
        (BEASTIE_SIZE[0] / 2 - (name_width + num_width + level_width)) / 2;

      ctx.fillStyle = "#808080";
      ctx.fillText(num_text, startx + start_offset + name_width, starty + 8);
      ctx.fillStyle = "black";
      ctx.font = REGULAR_FONT;
      ctx.fillText(display_name, startx + start_offset, starty + 3);
      ctx.fillText(
        level_text,
        startx + start_offset + name_width + num_width,
        starty + 3,
      );

      if (beastie.name && beastie.name != beastiedata.name) {
        ctx.fillStyle = "#2f4f4f";
        ctx.textAlign = "center";
        ctx.font = SMALLTEXT_FONT;
        ctx.fillText(
          `(${beastiedata.name})`,
          startx + BEASTIE_SIZE[0] / 4,
          starty + 22,
        );
      }

      const beastieColors = beastie.color.map(
        (value) => value - Math.ceil(value) + 1,
      );

      const result = await beastieRender({
        id: beastiedata.id,
        colors: beastieColors,
        colorAlt: altMap[Math.ceil(beastie.color[0])],
        sprAlt: beastie.spr_index,
      });
      if (!result) {
        throw new Error("Could not render Beastie.");
      }
      const [canvas, bbox] = result;
      if (bbox) {
        const width =
          bbox.width > bbox.height
            ? BEASTIE_IMAGE
            : bbox.width * (BEASTIE_IMAGE / bbox.height);
        const height =
          bbox.width > bbox.height
            ? bbox.height * (BEASTIE_IMAGE / bbox.width)
            : BEASTIE_IMAGE;
        ctx.drawImage(
          canvas,
          bbox.x,
          bbox.y,
          bbox.width,
          bbox.height,
          startx + BEASTIE_IMAGE_OFFSET + (BEASTIE_IMAGE - width) / 2,
          starty + BEASTIE_PLAY_BEGIN - (BEASTIE_IMAGE + height) / 2 - 10,
          width,
          height,
        );
      }
      // plays
      for (let i = 0; i < beastie.attklist.length; i++) {
        const move = MOVE_DIC[beastie.attklist[i]];
        const color = TypeData[move.type].color;
        const playx =
          startx + BEASTIE_PLAY_SIZE[0] * i + BEASTIE_PLAY_GAP * (i + 1);
        ctx.fillStyle = color;
        ctx.fillRect(
          playx,
          starty + BEASTIE_PLAY_BEGIN,
          BEASTIE_PLAY_SIZE[0],
          BEASTIE_PLAY_SIZE[1],
        );
        ctx.fillStyle = "black";
        ctx.fillRect(
          playx,
          starty + BEASTIE_PLAY_BEGIN,
          BEASTIE_PLAY_BLOCK,
          BEASTIE_PLAY_SIZE[1],
        );
        ctx.textBaseline = "middle";
        ctx.font = REGULAR_FONT;
        const last_space = move.name.lastIndexOf(" ");
        if (last_space == -1 || move.name.length < 9) {
          ctx.textAlign = "right";
          ctx.fillText(
            move.name,
            playx + BEASTIE_PLAY_SIZE[0],
            starty + BEASTIE_PLAY_BEGIN + BEASTIE_PLAY_SIZE[1] / 2,
            BEASTIE_PLAY_SIZE[0] - BEASTIE_PLAY_BLOCK,
          );
        } else {
          ctx.textAlign = "center";
          const slicepos = last_space == -1 ? 8 : last_space;
          const line1 = move.name.slice(0, slicepos);
          const line2 = move.name.slice(slicepos + (last_space == -1 ? 0 : 1));
          ctx.fillText(
            line1,
            playx +
              BEASTIE_PLAY_BLOCK +
              (BEASTIE_PLAY_SIZE[0] - BEASTIE_PLAY_BLOCK) / 2,
            starty + BEASTIE_PLAY_BEGIN + BEASTIE_PLAY_SIZE[1] / 4 + 1,
            BEASTIE_PLAY_SIZE[0] - BEASTIE_PLAY_BLOCK,
          );
          ctx.fillText(
            line2,
            playx +
              BEASTIE_PLAY_BLOCK +
              (BEASTIE_PLAY_SIZE[0] - BEASTIE_PLAY_BLOCK) / 2,
            starty + BEASTIE_PLAY_BEGIN + (BEASTIE_PLAY_SIZE[1] / 4) * 3 + 1,
            BEASTIE_PLAY_SIZE[0] - BEASTIE_PLAY_BLOCK,
          );
        }
        const imageY =
          starty +
          BEASTIE_PLAY_BEGIN +
          (BEASTIE_PLAY_SIZE[1] - BEASTIE_PLAY_BLOCK) / 2;
        ctx.drawImage(
          typeImages[move.type],
          playx,
          imageY,
          BEASTIE_PLAY_BLOCK,
          BEASTIE_PLAY_BLOCK,
        );
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = color;
        ctx.fillRect(playx, imageY, BEASTIE_PLAY_BLOCK, BEASTIE_PLAY_BLOCK);
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = REGULAR_FONT;
      const text_middle = (BEASTIE_SIZE[0] / 4) * 3;
      const ability =
        abilities[
          beastiedata.ability[
            beastiedata.ability.length == 1 ? 0 : beastie.ability_index
          ]
        ];
      const [lines, images] = splitText(
        ability.desc.replace(/\|/, ""),
        ctx,
        BEASTIE_SIZE[0] / 2,
        loadImage,
      );
      const line_height = lines.length < 4 ? 24 : 20;
      const trait_height = (lines.length + 1) * line_height;
      const right_gap =
        (BEASTIE_PLAY_BEGIN - BEASTIE_STAT_HEIGHT - trait_height) / 3;
      const trait_begin = right_gap * 2 + BEASTIE_STAT_HEIGHT;
      ctx.fillStyle = "#2f4f4f";
      ctx.font = SMALLTEXT_FONT;
      ctx.fillText(ability.name, startx + text_middle, starty + trait_begin);
      ctx.font = REGULAR_FONT;
      ctx.fillStyle = "black";
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(
          lines[i],
          startx + text_middle,
          starty + trait_begin + 20 + line_height * i,
        );
      }
      for (const image of images) {
        const img = await image.image;
        ctx.drawImage(
          img,
          startx + text_middle + image.x,
          starty + trait_begin + 19 + line_height * image.line,
          (18 / img.height) * img.width,
          18,
        );
      }
      ctx.textBaseline = "top";
      ctx.fillText(
        "POW          DEF",
        startx + text_middle,
        starty + right_gap,
      );
      drawLines(
        ctx,
        startx + BEASTIE_SIZE[0] / 2 + BEASTIE_STAT_ICON,
        starty + right_gap + 22,
        BEASTIE_STAT_BAR,
        BEASTIE_STAT_BAR_HEIGHT * 3,
        BAR_COLORS[0],
        BAR_COLORS[1],
      );
      drawLines(
        ctx,
        startx + BEASTIE_SIZE[0] / 2 + BEASTIE_STAT_ICON * 2 + BEASTIE_STAT_BAR,
        starty + right_gap + 22,
        BEASTIE_STAT_BAR,
        BEASTIE_STAT_BAR_HEIGHT * 3,
        BAR_COLORS[0],
        BAR_COLORS[1],
      );
      ctx.textBaseline = "middle";
      const atkTrainings = [
        Math.floor(beastie.ba_t / 4),
        Math.floor(beastie.ha_t / 4),
        Math.floor(beastie.ma_t / 4),
      ];
      const maxAtk = statCalc(
        Math.max(beastiedata.ba, beastiedata.ha, beastiedata.ma),
        level,
        1,
        120,
      );

      for (let i = 0; i < 3; i++) {
        const statImg = await loadImage(`/gameassets/sprIcon/${i}.png`);
        ctx.drawImage(
          statImg,
          startx + BEASTIE_SIZE[0] / 2 + BEASTIE_STAT_ICON + BEASTIE_STAT_BAR,
          starty + right_gap + 22 + BEASTIE_STAT_BAR_HEIGHT * i + 1,
          BEASTIE_STAT_ICON,
          BEASTIE_STAT_ICON,
        );

        const statKey = ["ba", "ha", "ma"][i];
        const stat = statCalc(
          beastiedata[statKey as "ba" | "ha" | "ma"],
          level,
          maxCoaching
            ? 1
            : beastie[(statKey + "_r") as "ba_r" | "ha_r" | "ma_r"],
          beastie[(statKey + "_t") as "ba_t" | "ha_t" | "ma_t"],
        );
        ctx.fillStyle = TypeData[i].color;
        ctx.fillRect(
          startx +
            BEASTIE_SIZE[0] / 2 +
            BEASTIE_STAT_ICON +
            (1 - stat / maxAtk) * BEASTIE_STAT_BAR,
          starty + right_gap + 22 + BEASTIE_STAT_BAR_HEIGHT * i,
          (stat / maxAtk) * BEASTIE_STAT_BAR,
          BEASTIE_STAT_BAR_HEIGHT,
        );
        ctx.strokeStyle = TypeData[i].color;
        ctx.fillStyle = "black";
        const textX =
          startx +
          BEASTIE_SIZE[0] / 2 +
          BEASTIE_STAT_ICON +
          BEASTIE_STAT_BAR / 2;
        const textY =
          starty +
          right_gap +
          BEASTIE_STAT_TEXT_OFFSET +
          BEASTIE_STAT_BAR_HEIGHT / 2 +
          BEASTIE_STAT_BAR_HEIGHT * i;
        ctx.font = "25px SportsJersey";
        ctx.lineWidth = 3;
        ctx.strokeText(String(stat), textX, textY);
        ctx.fillText(String(stat), textX, textY);
        ctx.font = REGULAR_FONT;
        ctx.fillText(
          `+${atkTrainings[i]}`,
          startx + BEASTIE_SIZE[0] / 2 + BEASTIE_STAT_ICON / 2,
          textY,
        );
      }
      const defTrainings = [
        Math.floor(beastie.bd_t / 4),
        Math.floor(beastie.hd_t / 4),
        Math.floor(beastie.md_t / 4),
      ];
      const maxDef = statCalc(
        Math.max(beastiedata.bd, beastiedata.hd, beastiedata.md),
        level,
        1,
        120,
      );
      for (let i = 0; i < 3; i++) {
        const statKey = ["bd", "hd", "md"][i];
        const stat = statCalc(
          beastiedata[statKey as "bd" | "hd" | "md"],
          level,
          maxCoaching
            ? 1
            : beastie[(statKey + "_r") as "bd_r" | "hd_r" | "md_r"],
          beastie[(statKey + "_t") as "bd_t" | "hd_t" | "md_t"],
        );
        ctx.fillStyle = TypeData[i].color;
        ctx.fillRect(
          startx +
            BEASTIE_SIZE[0] / 2 +
            BEASTIE_STAT_ICON * 2 +
            BEASTIE_STAT_BAR,
          starty + right_gap + 22 + BEASTIE_STAT_BAR_HEIGHT * i,
          (stat / maxDef) * BEASTIE_STAT_BAR,
          BEASTIE_STAT_BAR_HEIGHT,
        );
        ctx.strokeStyle = TypeData[i].color;
        ctx.fillStyle = "black";
        const textX =
          startx +
          BEASTIE_SIZE[0] / 2 +
          BEASTIE_STAT_ICON * 2 +
          (BEASTIE_STAT_BAR / 2) * 3;
        const textY =
          starty +
          right_gap +
          BEASTIE_STAT_TEXT_OFFSET +
          BEASTIE_STAT_BAR_HEIGHT / 2 +
          BEASTIE_STAT_BAR_HEIGHT * i;
        ctx.font = "25px SportsJersey";
        ctx.lineWidth = 3;
        ctx.strokeText(String(stat), textX, textY);
        ctx.fillText(String(stat), textX, textY);
        ctx.font = REGULAR_FONT;
        ctx.fillText(
          `+${defTrainings[i]}`,
          startx +
            BEASTIE_SIZE[0] / 2 +
            BEASTIE_STAT_BAR * 2 +
            (BEASTIE_STAT_ICON / 2) * 5,
          textY,
        );
      }
    }
  }
}
