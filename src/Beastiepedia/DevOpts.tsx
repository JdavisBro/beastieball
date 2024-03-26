import "jszip";
import BEASTIE_DATA from "../data/Beastiedata";
import BEASTIE_ANIMATIONS from "../data/BeastieAnimations";
import SPRITE_INFO, { BBox } from "../data/SpriteInfo";
import { useRef } from "react";
import JSZip from "jszip";
import { setColorUniforms, setImage } from "./Preview/WebGL";
import { getColorInBeastieColors } from "../utils/color";

declare global {
  interface Window {
    saveBeastieIcons: () => void;
  }
}

const ICON_SIZE = 256;

export default function DevOpts(props: {
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

  window.saveBeastieIcons = () => {
    loadedNumRef.current = 0;
    beastieCountRef.current = 0;
    loadingRef.current = {};
    BEASTIE_DATA.forEach((beastie) => {
      const sprite = SPRITE_INFO[beastie.spr];
      const img = document.createElement("img");
      const anims = BEASTIE_ANIMATIONS.get(`_${sprite.name}`);
      const anim_data = anims?.anim_data;
      if (anim_data === undefined) {
        return;
      }
      const anim = anim_data.idle;
      const frames = Array.isArray(anim.frames) ? anim.frames[0] : anim.frames;
      const frame = frames.startFrame != undefined ? frames.startFrame : 0;
      img.addEventListener("load", imgLoad);
      img.src = `/gameassets/beasties/${sprite.name}/${frame % sprite.frames}.png`;
      loadingRef.current[beastie.name] = {
        img: img,
        crop: sprite.bboxes[frame % sprite.frames],
        colors: beastie.colors,
      };
      beastieCountRef.current += 1;
    });
  };
  return null;
}
