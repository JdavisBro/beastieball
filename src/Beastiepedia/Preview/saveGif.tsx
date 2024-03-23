import { GIFEncoder, applyPalette, quantize } from "gifenc";

import { BeastieAnimation } from "../../data/BeastieAnimations";
import { setImage } from "./WebGL";
import { BBox } from "../../data/SpriteInfo";

export class GifError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, GifError.prototype);
  }
}

function flipImageData(non_clamped_data: Uint8Array, w: number, h: number) {
  const data = Uint8ClampedArray.from(non_clamped_data);
  Array.from({ length: h }, (_val, i) =>
    data.slice(i * w * 4, (i + 1) * w * 4),
  ).forEach((val, i) => data.set(val, (h - i - 1) * w * 4));
  return data;
}

export default function saveGif(
  gl: WebGLRenderingContext | null,
  crop: boolean,
  name: string,
  images: { [key: number]: HTMLImageElement } | null,
  anim: BeastieAnimation | undefined,
  anim_speed: number | null,
  bboxes: BBox[],
) {
  if (!gl) {
    throw new GifError("No GL");
  }
  if (!images) {
    throw new GifError("Images not Loaded");
  }
  if (!anim) {
    throw new GifError("Incorrect Animation");
  }
  if (typeof anim_speed != "number") {
    throw new GifError("Incorrect Animation Speed");
  }
  const baseTime =
    (1000 / (24 * anim_speed) / (anim.speed ? anim.speed : 1)) * 2;
  const frames = Array.isArray(anim.frames) ? anim.frames : [anim.frames];
  const uniqueframes: number[] = [];
  const framelist: number[] = [];
  const delaylist = [];
  let groupindex = 0;
  const bbox: { x?: number; y?: number; endx?: number; endy?: number } = crop
    ? { x: undefined, y: undefined, endx: undefined, endy: undefined }
    : { x: 0, y: 0, endx: 1000, endy: 1000 };
  function setBbox(framebbox: BBox) {
    if (
      bbox.x == undefined ||
      bbox.y == undefined ||
      bbox.endx == undefined ||
      bbox.endy == undefined
    ) {
      bbox.x = framebbox.x;
      bbox.y = framebbox.y;
      bbox.endx = framebbox.x + framebbox.width;
      bbox.endy = framebbox.y + framebbox.height;
    } else {
      bbox.x = Math.min(bbox.x, framebbox.x);
      bbox.y = Math.min(bbox.y, framebbox.y);
      bbox.endx = Math.max(bbox.endx, framebbox.x + framebbox.width);
      bbox.endy = Math.max(bbox.endy, framebbox.y + framebbox.height);
    }
  }
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    const group = frames[groupindex];
    const startFrame = group.startFrame != null ? group.startFrame : 0;
    const endFrame = group.endFrame != null ? group.endFrame : 0;
    for (let i = startFrame; i <= endFrame; i++) {
      if (images[i] == undefined) {
        throw new GifError("Required image not loaded.");
      }
      framelist.push(i);
      if (!uniqueframes.includes(i)) {
        uniqueframes.push(i);
      }
      setBbox(bboxes[i]);
      const holds = group.holds;
      let hold = 1;
      if (holds) {
        if (holds[String(i)] != undefined) {
          const temphold = holds[String(i)];
          if (Array.isArray(temphold)) {
            hold = temphold[Math.floor(Math.random() * temphold.length)];
          } else if (typeof temphold == "number") {
            hold = temphold;
          }
        }
      }
      delaylist.push(baseTime * hold);
    }
    if (!group.transitions || group.transitions.length == 0) {
      break;
    } else {
      groupindex = group.transitions[0];
      group.transitions.splice(0, 1);
    }
  }
  if (
    bbox.x == undefined ||
    bbox.y == undefined ||
    bbox.endx == undefined ||
    bbox.endy == undefined
  ) {
    throw new GifError("Bbox unchanged.");
  }
  const width = bbox.endx - bbox.x;
  const height = bbox.endy - bbox.y;

  // render unique frames to not render the same frame multiple times
  const doneframes: {
    [key: number]: { index?: Uint8Array; palette?: number[][] };
  } = {};
  for (const frame of uniqueframes) {
    setImage(gl, images[frame]);
    const data = new Uint8Array(width * height * 4);
    gl.readPixels(
      bbox.x,
      1000 - bbox.endy, // flipped image means what we want is at the top
      width,
      height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data,
    );
    // read pixels comes in upside down so i need to flip the image data
    const pixelData = flipImageData(data, width, height);
    const palette = quantize(pixelData, 256, {
      format: "rgba4444",
      oneBitAlpha: true,
    });
    const index = applyPalette(pixelData, palette, "rgba4444");
    doneframes[frame] = { index: index, palette: palette };
  }

  // put our frames together
  const encoder = GIFEncoder();
  for (let i = 0; i < framelist.length; i++) {
    const frame = framelist[i];
    const index = doneframes[frame].index;
    if (index == undefined) {
      continue;
    }
    encoder.writeFrame(index, width, height, {
      delay: delaylist[i],
      palette: doneframes[frame].palette,
      transparent: true,
    });
  }
  encoder.finish();
  const a = document.createElement("a");
  a.download = `${name}.gif`;
  a.href = URL.createObjectURL(
    new Blob([encoder.bytes()], { type: "image/gif" }),
  );
  a.click();
}
