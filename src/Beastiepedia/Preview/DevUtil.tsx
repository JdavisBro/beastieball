import BEASTIE_DATA from "../../data/BeastieData";
import BEASTIE_ANIMATIONS from "../../data/BeastieAnimations";
import SPRITE_INFO, { BBox } from "../../data/SpriteInfo";
import { useRef } from "react";
import JSZip from "jszip";
import { setColorUniforms, setImage } from "../../shared/beastieRender/WebGL";
import { bgrDecimalToHex, getColorInBeastieColors } from "../../utils/color";
import { BeastieType } from "../../data/BeastieData";

declare global {
  interface Window {
    saveBeastieImages: (icons: boolean) => void;
    getWikiColorArgs: (beastiedata: BeastieType) => string;
  }
}

const ICON_SIZE = 256;

export default function DevUtil(props: {
  glRef: React.MutableRefObject<WebGLRenderingContext | null>;
  programRef: React.MutableRefObject<WebGLProgram | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropCanvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const loadingRef = useRef<{
    [key: string]: {
      img: HTMLImageElement;
      crop: BBox;
      colors: {
        array: {
          color: number;
          x: number;
        }[];
      }[];
    };
  }>({});
  const loadedNumRef = useRef(0);
  const beastieCountRef = useRef(0);
  const iconsRef = useRef(false);

  const allDone = () => {
    const gl = props.glRef.current;
    const program = props.programRef.current;
    const canvas = props.canvasRef.current;
    const cropCanvas = props.cropCanvasRef.current;
    if (!gl || !canvas || !cropCanvas || !program) {
      return;
    }
    const ctx = cropCanvas.getContext("2d");
    if (!ctx) {
      return;
    }
    cropCanvas.width = ICON_SIZE;
    cropCanvas.height = ICON_SIZE;
    const zip = new JSZip();
    Object.keys(loadingRef.current).forEach((name) => {
      const { img, crop, colors } = loadingRef.current[name];
      setColorUniforms(
        gl,
        program,
        colors.map((col) => getColorInBeastieColors(0.5, col.array)),
      );
      setImage(gl, img);
      ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);

      if (!iconsRef.current) {
        cropCanvas.width = crop.width;
        cropCanvas.height = crop.height;

        ctx.drawImage(
          canvas,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height,
        );
      } else {
        const imscale = Math.max(crop.width, crop.height) / ICON_SIZE;

        ctx.drawImage(
          canvas,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          -(crop.width / imscale - ICON_SIZE) / 2,
          -(crop.height / imscale - ICON_SIZE) / 2,
          crop.width / imscale,
          crop.height / imscale,
        );
      }
      zip.file(
        `${name}.png`,
        cropCanvas.toDataURL("image/png").split("base64,")[1],
        { base64: true },
      );
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const a = document.createElement("a");
      a.download = `beastieIcons.zip`;
      a.href = URL.createObjectURL(content);
      a.click();
    });
  };

  const imgLoad = () => {
    loadedNumRef.current += 1;
    console.log(`${loadedNumRef.current}/${beastieCountRef.current}`);
    if (loadedNumRef.current >= beastieCountRef.current) {
      allDone();
    }
  };

  // Use in developer console as just `saveBeastieImages( true | false )
  // Saves zip of images of all beasties. If icons is true then it makes them ICON_SIZE square.
  window.saveBeastieImages = (icons) => {
    iconsRef.current = icons;
    loadedNumRef.current = 0;
    beastieCountRef.current = 0;
    loadingRef.current = {};
    BEASTIE_DATA.forEach((beastie) => {
      const sprite = SPRITE_INFO[beastie.spr];
      if (!sprite) {
        return;
      }
      const img = document.createElement("img");
      const anims = BEASTIE_ANIMATIONS.get(`_${sprite.name}`);
      const anim_data = anims?.anim_data;
      if (anim_data === undefined) {
        return;
      }
      const anim = anim_data.menu ?? anim_data.idle;
      const frames = Array.isArray(anim.frames) ? anim.frames[0] : anim.frames;
      const frame = frames.endFrame != undefined ? frames.endFrame : 0;
      img.addEventListener("load", imgLoad);
      img.addEventListener("error", () => {
        console.log(`${sprite.name} not found`);
        loadedNumRef.current += 1;
        if (loadedNumRef.current >= beastieCountRef.current) {
          allDone();
        }
      });
      img.src = `/gameassets/beasties/${sprite.name}/${frame % sprite.frames}.png`;
      loadingRef.current[beastie.name] = {
        img: img,
        crop: sprite.bboxes[frame % sprite.frames],
        colors: beastie.colors,
      };
      beastieCountRef.current += 1;
    });
  };

  window.getWikiColorArgs = (beastiedata: BeastieType) => {
    const normal = beastiedata.colors
      .map(
        (colors, index) =>
          ` |color${index + 1}=${colors.array
            .map(
              (value) =>
                `#${bgrDecimalToHex(value.color)} ${Math.round(value.x * 100)}%`,
            )
            .join(", ")}`,
      )
      .join("\n");
    let alt = "";
    if (beastiedata.colors2) {
      alt = beastiedata.colors2
        .map(
          (colors, index) =>
            ` |color${index + 1}alt=${colors.array
              .map(
                (value) =>
                  `#${bgrDecimalToHex(value.color)} ${Math.round(value.x * 100)}%`,
              )
              .join(", ")}`,
        )
        .join("\n");
    }
    const rare = beastiedata.shiny
      .map(
        (colors, index) =>
          ` |color${index + 1}rare=${colors.array
            .map(
              (value) =>
                `#${bgrDecimalToHex(value.color)} ${Math.round(value.x * 100)}%`,
            )
            .join(", ")}`,
      )
      .join("\n");
    return "\n" + normal + "\n" + alt + (alt ? "\n" : "") + rare;
  };

  return null;
}
