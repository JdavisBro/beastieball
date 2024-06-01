import { GIFEncoder, applyPalette, quantize } from "gifenc";

import { BeastieAnimation } from "../../data/BeastieAnimations";
import { setImage } from "../../shared/beastieRender/WebGL";
import { BBox, Sprite } from "../../data/SpriteInfo";

const MAX_LOOPS = 500;
const DELAY_MIN = 20; // ms

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
  gl: WebGLRenderingContext,
  crop: boolean,
  name: string,
  images: { [key: number]: HTMLImageElement },
  anim: BeastieAnimation,
  user_speed: number,
  anim_speed: number,
  sprite: Sprite,
  return_frame: number,
) {
  const frames = Array.isArray(anim.frames) ? anim.frames : [anim.frames];
  const uniqueframes: number[] = [];
  const framelist: number[] = [];
  const delaylist = [];
  const baseDelay =
    1000 / (24 * anim_speed) / (anim.speed ? anim.speed : 1) / user_speed;

  let bbox: { x: number; y: number; endx: number; endy: number } | undefined =
    crop ? undefined : { x: 0, y: 0, endx: 1000, endy: 1000 };
  function setBbox(framebbox: BBox) {
    if (!crop) {
      return;
    }
    if (bbox == undefined) {
      bbox = {
        x: framebbox.x,
        y: framebbox.y,
        endx: framebbox.x + framebbox.width,
        endy: framebbox.y + framebbox.height,
      };
    } else {
      bbox.x = Math.min(bbox.x, framebbox.x);
      bbox.y = Math.min(bbox.y, framebbox.y);
      bbox.endx = Math.max(bbox.endx, framebbox.x + framebbox.width);
      bbox.endy = Math.max(bbox.endy, framebbox.y + framebbox.height);
    }
  }

  const transitionedto: { [key: number]: number } = {};
  frames.forEach((value) => {
    if (value?.transitions) {
      value?.transitions.forEach((target) => {
        transitionedto[target] =
          transitionedto[target] != undefined ? transitionedto[target] + 1 : 1;
      });
    }
  });

  let basegroup = frames.findIndex(
    (_value, index) => transitionedto[index] != undefined,
  );
  basegroup = basegroup != -1 ? basegroup : 0;

  let groupindex = basegroup;

  const grouptransition: { [key: number]: number } = {};
  Object.keys(transitionedto).forEach(
    (_value, index) => (grouptransition[index] = 0),
  );

  let loop = 0;
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    loop++;
    if (loop > MAX_LOOPS) {
      throw new GifError("TOO MANY LOOPS!");
    }

    const group = frames[groupindex];
    if ((!group.transitions || group.transitions.length == 0) && loop != 1) {
      break;
    }

    const startFrame = group.startFrame != null ? group.startFrame : 0;
    const endFrame = group.endFrame != null ? group.endFrame : 0;
    for (let i = startFrame; i <= endFrame; i++) {
      if (images[i % sprite.frames] == undefined) {
        throw new GifError("Required image not loaded.");
      }
      framelist.push(i % sprite.frames);
      if (!uniqueframes.includes(i % sprite.frames)) {
        uniqueframes.push(i % sprite.frames);
      }
      setBbox(sprite.bboxes[i % sprite.frames]);
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
      delaylist.push(Math.max(DELAY_MIN, baseDelay * hold));
    }
    if (!group.transitions) {
      break;
    }
    if (groupindex == basegroup) {
      groupindex = group.transitions[0];
      group.transitions.splice(0, 1);
    } else {
      // im trying to prioritise getting to the other states before going to state 0 to possibly end the animation
      // this stuff can probably not be fully done automatically and i might add an editor to the site that lets users sequence their own state order
      grouptransition[groupindex] += 1;
      if (grouptransition[groupindex] - 1 < group.transitions.length) {
        groupindex = group.transitions.sort((a, b) =>
          a != basegroup ? a - b : b - a,
        )[grouptransition[groupindex] - 1];
      } else {
        groupindex = group.transitions.sort(
          (a, b) => grouptransition[a] - grouptransition[b],
        )[0];
      }
    }
  }
  if (bbox == undefined) {
    throw new GifError("Bbox unchanged.");
  }
  const width = bbox.endx - bbox.x;
  const height = bbox.endy - bbox.y;

  // render unique frames to not render the same frame multiple times
  const doneframes: {
    [key: number]: { index?: Uint8Array; palette?: number[][] };
  } = {};
  for (const frame of uniqueframes) {
    setImage(gl, images[frame % sprite.frames]);
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

  setImage(gl, images[return_frame % sprite.frames]);

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
