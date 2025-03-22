import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import setupWebGL, { setColorUniforms, setImage } from "./WebGL";
import {
  BeastieRenderContext,
  RenderBeastieType,
} from "./BeastieRenderContext";
import SPRITE_INFO, { BBox } from "../../data/SpriteInfo";
import BEASTIE_DATA from "../../data/BeastieData";
import { getColorInBeastieColors } from "../../utils/color";
import BEASTIE_ANIMATIONS, {
  BeastieAnimData,
} from "../../data/BeastieAnimations";

export default function BeastieRenderProvider(
  props: PropsWithChildren,
): React.ReactElement {
  const nextIdRef = useRef(0);
  const jobsRef = useRef<{ [id: number]: (cancelled: boolean) => void }>({});
  const renderJobs = useRef<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
  } | null>(null);

  const frame = useCallback(() => {
    if (renderJobs.current.length > 0) {
      jobsRef.current[renderJobs.current[0]](false);
      if (jobsRef.current) {
        requestAnimationFrame(frame);
      }
    }
  }, []);

  const renderQuick = useCallback(async (beastie: RenderBeastieType) => {
    if (!canvasRef.current || !cropCanvasRef.current || !glRef.current) {
      return null;
    }

    const beastie_data = BEASTIE_DATA.get(beastie.id);
    if (!beastie_data) {
      console.log("Beastie render failed. Fake beastie");
      return null;
    }
    const sprite = SPRITE_INFO[beastie_data.spr];
    const sprAlt = beastie.sprAlt;
    const drawn_name =
      !sprAlt || sprAlt > beastie_data.spr_alt.length
        ? beastie_data.spr
        : beastie_data.spr_alt[sprAlt - 1];
    const drawn_sprite = SPRITE_INFO[drawn_name];
    if (!sprite || !drawn_sprite) {
      console.log(
        "Beastie render failed. SPRITE: ",
        !!sprite,
        "DRAWN_SPRITE: ",
        !!drawn_sprite,
      );
      return null;
    }
    const animations = BEASTIE_ANIMATIONS.get(`_${beastie_data.spr}`);
    let frames = (animations?.anim_data as BeastieAnimData).menu.frames;
    if (frames && Array.isArray(frames)) {
      frames = frames[0];
    }
    const beastie_frame =
      (beastie.frame ?? frames) ? (frames?.startFrame ?? 0) : 0;

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = document.createElement("img");
      image.src = `/gameassets/beasties/${drawn_name}/${beastie_frame ?? 0}.webp`;
      image.onerror = () => reject();
      image.onload = () => resolve(image);
    }).catch((error) => console.log(error));
    if (!img) {
      return null;
    }
    setImage(glRef.current.gl, img);

    const beastieColors =
      beastie.colorAlt == "colors2" && beastie_data.colors2
        ? beastie_data.colors2
        : beastie.colorAlt == "shiny"
          ? beastie_data.shiny
          : beastie_data.colors;
    const colors = beastie.colors ?? [0.5, 0.5, 0.5, 0.5, 0.5];
    const cols = [...Array(beastieColors.length).keys()].map((value) => {
      const x = colors.length < value ? 0.5 : colors[value];
      return getColorInBeastieColors(x, beastieColors[value].array);
    });
    setColorUniforms(glRef.current.gl, glRef.current.program, cols);
    const sprite_bbox = drawn_sprite.bboxes[beastie_frame];
    return [canvasRef.current, sprite_bbox] as [HTMLCanvasElement, BBox | null];
  }, []);

  const render = useCallback(
    (beastie: RenderBeastieType) => {
      const id = nextIdRef.current;
      nextIdRef.current += 1;
      const urlFunc = async () => {
        if (renderJobs.current.length == 0) {
          requestAnimationFrame(frame);
        }
        const cancelled = await new Promise<boolean>((resolve) => {
          renderJobs.current.push(id);
          jobsRef.current[id] = resolve;
        }).catch((error) => console.log(error));
        delete jobsRef.current[id];
        renderJobs.current.splice(renderJobs.current.indexOf(id), 1);

        if (cancelled) {
          return null;
        }

        if (!cropCanvasRef.current) {
          return null;
        }

        const result = await renderQuick(beastie);
        if (!result) {
          return null;
        }
        const [drawn_canvas, sprite_bbox] = result;

        const context = cropCanvasRef.current.getContext("2d");
        if (!context) {
          return null;
        }
        if (!sprite_bbox) {
          return drawn_canvas.toDataURL();
        }
        cropCanvasRef.current.width = sprite_bbox.width;
        cropCanvasRef.current.height = sprite_bbox.height;
        context.drawImage(drawn_canvas, -sprite_bbox.x, -sprite_bbox.y);
        const url = cropCanvasRef.current.toDataURL();

        return url;
      };

      return { id: id, url: urlFunc() };
    },
    [frame, renderQuick],
  );

  const cancel = useCallback((id: number) => {
    if (!jobsRef.current[id]) {
      return;
    }
    jobsRef.current[id](true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || glRef.current) {
      return;
    }
    glRef.current = setupWebGL(canvasRef.current);
  }, []);

  const value = useMemo(
    () => ({ render, cancel, renderQuick }),
    [render, cancel, renderQuick],
  );

  return (
    <BeastieRenderContext.Provider value={value}>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={1000}
        height={1000}
        id="beastieRenderCanvas"
      />
      <canvas
        ref={cropCanvasRef}
        style={{ display: "none" }}
        id="beastieCropCanvas"
      />
      {props.children}
    </BeastieRenderContext.Provider>
  );
}
