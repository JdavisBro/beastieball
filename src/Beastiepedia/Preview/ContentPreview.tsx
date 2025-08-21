import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import setupWebGL, {
  WebGLError,
  setColorUniforms,
  setImage,
} from "../../shared/beastieRender/WebGL";
import styles from "./ContentPreview.module.css";
import type { BeastieType } from "../../data/BeastieData";
import ColorTabs from "./ColorTabs";
import SPRITE_INFO, { Sprite } from "../../data/SpriteInfo";
import useLoadBeastieImages from "./useLoadBeastieImages.ts";
import BEASTIE_ANIMATIONS, {
  BeastieAnimation,
  BeastieAnimData,
} from "../../data/BeastieAnimations";
import { hexToRgb } from "../../utils/color";
import saveGif from "./saveGif";
import AnimationOptions from "./AnimationOptions";
import PreviewSettings from "./PreviewSettings";
import useScreenOrientation from "../../utils/useScreenOrientation";
import { AnimationState, setupFrameCallback } from "./frameCallback.ts";
import ImageContextMenu from "./ImageContextMenu.tsx";

const DevUtil = import.meta.env.DEV
  ? lazy(() => import("./DevUtil.tsx"))
  : () => null;

type Props = {
  beastiedata: BeastieType;
};

function isAnimEmpty(anim: BeastieAnimation | number | string | undefined) {
  if (!anim || typeof anim == "number" || typeof anim == "string") {
    return true;
  }
  if (Array.isArray(anim.frames)) {
    return false;
  }
  return !anim.frames.startFrame && !anim.frames.endFrame;
}

export const ANIMATION_LIST = [
  "idle",
  "move",
  "ready",
  "spike",
  "volley",
  "good",
  "bad",
  "fall",
  "menu",
  "air",
  "stop",
  "hug", // troglum
  "special", // conjarr
];

const ANIMATION_ALWAYS_SHOW = ["idle", "menu"];

const IDLE_EXCEPTIONS = ["sprServal", "sprDragonfly", "sprOppossum"];
const MOVE_EXCEPTIONS = ["sprSeal", "sprDragonfly"];

function anim_check(anim: string, beastie: BeastieType) {
  const progress = beastie.anim_progress;
  const sprite = beastie.spr;
  if (anim == "idle" && progress < 95 && !IDLE_EXCEPTIONS.includes(sprite)) {
    return "menu";
  } else if (
    anim == "move" &&
    progress < 80 &&
    !MOVE_EXCEPTIONS.includes(sprite)
  ) {
    return "menu";
  }
  return anim;
}

export default function ContentPreview(props: Props): React.ReactNode {
  const [colors, setColors] = useState<number[][]>([
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
  ]);

  const [alt, setAlt] = useState(-1);

  useEffect(() => setAlt(-1), [props.beastiedata.id]);

  const beastiesprite = SPRITE_INFO[props.beastiedata.spr] as Sprite;
  const drawnname =
    alt == -1 && props.beastiedata.spr_alt.length
      ? props.beastiedata.spr
      : (props.beastiedata.spr_alt[alt] ?? props.beastiedata.spr);
  const drawnsprite = SPRITE_INFO[drawnname];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext>(null);
  const programRef = useRef<WebGLProgram>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const [rowdy, setRowdy] = useState(false);

  const secrets = localStorage.getItem("secrets") == "true";

  const [animationState, setAnimation] = useState("idle");
  const animdata: BeastieAnimData | undefined = BEASTIE_ANIMATIONS.get(
    `_${props.beastiedata.spr}`,
  )?.anim_data as BeastieAnimData;

  const animation = secrets
    ? animationState
    : anim_check(animationState, props.beastiedata);

  let anim: BeastieAnimation | undefined = undefined;
  const tempanim = animdata
    ? animation in animdata
      ? animdata[animation]
      : animdata.idle
    : undefined;
  if (
    tempanim != undefined &&
    typeof tempanim != "number" &&
    typeof tempanim != "string"
  ) {
    anim = tempanim;
  }

  const [userSpeed, setUserSpeed] = useState(1);

  const beastieIdRef = useRef(props.beastiedata.id);

  const loadedImages = useLoadBeastieImages(
    `/gameassets/beasties/${drawnname}`,
    beastiesprite.frames,
    beastieIdRef.current == props.beastiedata.id,
  );
  const animStateRef = useRef<AnimationState>({
    request: 0,
    frame: undefined,
    anim: anim,
    state: undefined,
    frameTime: 0,
    frameLength: undefined,
    prevTime: 0,
    userSpeed: userSpeed,
  });
  animStateRef.current.userSpeed = userSpeed;

  const [paused, setPaused] = useState(false);

  const frameInputRef = useRef<HTMLInputElement>(null);

  const [noDisplayRenderState, setNoDisplayRender] = useState(true);
  const noDisplayRender =
    beastieIdRef.current != props.beastiedata.id || noDisplayRenderState;
  const [noDisplayReason, setNoDisplayReason] = useState("Loading...");

  const setFrame = useCallback(
    (frame: number) => {
      if (glRef.current && loadedImages[frame % drawnsprite.frames]) {
        animStateRef.current.frame = frame;
        setImage(glRef.current, loadedImages[frame % drawnsprite.frames]);
        setNoDisplayRender(false);
        if (frameInputRef.current) {
          frameInputRef.current.value = String(frame);
        }
      } else if (!loadedImages[frame % drawnsprite.frames]) {
        setNoDisplayRender(true);
        setNoDisplayReason("Loading...");
      }
    },
    [loadedImages, drawnsprite.frames],
  );

  const changeFrame = useCallback(
    (diff: number) => {
      setPaused(true);
      setFrame(
        Math.min(
          beastiesprite.frames - 1,
          Math.max(0, (animStateRef.current.frame ?? 0) + diff),
        ),
      );
    },
    [setFrame, beastiesprite],
  );

  const [bbox, allFramesLoaded] = useMemo(() => {
    let allFramesLoaded = true;
    let edges:
      | { x: number; y: number; endx: number; endy: number }
      | undefined = undefined;
    if (anim && !paused) {
      const frames = Array.isArray(anim.frames) ? anim.frames : [anim.frames];
      const possibleFrames = [0];
      const checkedFrames = [];
      for (let i = 0; i < possibleFrames.length; i++) {
        const state = frames[possibleFrames[i]];
        if (state.transitions?.length) {
          for (const transition of state.transitions) {
            if (!possibleFrames.includes(transition)) {
              possibleFrames.push(transition);
            }
          }
        }
        checkedFrames.push(possibleFrames[i]);
      }
      for (const stateIndex of possibleFrames) {
        const state = frames[stateIndex];
        const startFrame = state.startFrame || 0;
        const endFrame = state.endFrame || 0;
        const reverse = startFrame > endFrame;
        for (
          let i = reverse ? endFrame : startFrame;
          i <= (reverse ? startFrame : endFrame);
          i++
        ) {
          if (!loadedImages[i % drawnsprite.frames]) {
            allFramesLoaded = false;
          }
          const framebbox = drawnsprite.bboxes[i % drawnsprite.frames];
          if (!framebbox) {
            continue;
          }
          if (edges == undefined) {
            edges = {
              x: framebbox.x,
              y: framebbox.y,
              endx: framebbox.x + framebbox.width,
              endy: framebbox.y + framebbox.height,
            };
          } else {
            edges.x = Math.min(edges.x, framebbox.x);
            edges.y = Math.min(edges.y, framebbox.y);
            edges.endx = Math.max(edges.endx, framebbox.x + framebbox.width);
            edges.endy = Math.max(edges.endy, framebbox.y + framebbox.height);
          }
        }
      }
    }
    let bbox;
    if (!edges) {
      bbox = drawnsprite.bbox;
    } else {
      bbox = {
        x: edges.x,
        y: edges.y,
        width: edges.endx - edges.x,
        height: edges.endy - edges.y,
      };
    }
    return [bbox, allFramesLoaded];
  }, [anim, drawnsprite, loadedImages, paused]);

  const beastiescale =
    bbox.width > bbox.height
      ? drawnsprite.width / bbox.width
      : drawnsprite.height / bbox.height;
  const crop = `scale(${beastiescale}) translate(${((-bbox.x - bbox.width / 2 + drawnsprite.width / 2) / drawnsprite.width) * 100}%, ${((-bbox.y - bbox.height / 2 + drawnsprite.height / 2) / drawnsprite.height) * 100}%)`;

  const [fitBeastie, setFitBeastie] = useState(true);

  useEffect(() => {
    if (paused) {
      if (animStateRef.current.frame != undefined) {
        setFrame(animStateRef.current.frame);
      }
      return;
    }

    if (anim && anim != animStateRef.current.anim) {
      animStateRef.current.anim = anim;
    }
    if (!animStateRef.current.anim) {
      return;
    }

    if (!allFramesLoaded) {
      const state =
        animStateRef.current.state ||
        (Array.isArray(animStateRef.current.anim.frames)
          ? animStateRef.current.anim.frames[0]
          : animStateRef.current.anim.frames);
      const startFrame = state.startFrame ?? 0;
      if (animStateRef.current.frame != startFrame) {
        setFrame(startFrame);
      }
      return;
    }

    return setupFrameCallback(
      setFrame,
      animStateRef,
      animdata.__anim_speed ?? 1,
    );
  }, [setFrame, anim, allFramesLoaded, animdata.__anim_speed, paused]);

  useEffect(() => {
    animStateRef.current = {
      ...animStateRef.current,
      state: undefined,
      frameLength: 0,
      anim: anim,
      frame: undefined,
    };
  }, [anim]);

  useEffect(() => {
    if (animStateRef.current.frame) {
      setFrame(animStateRef.current.frame);
    }
  }, [drawnsprite, setFrame]);

  useEffect(() => {
    beastieIdRef.current = props.beastiedata.id;
    setNoDisplayRender(true);
    setNoDisplayReason("Loading...");
  }, [props.beastiedata.id]);

  useEffect(() => {
    if (
      canvasRef.current &&
      ((glRef.current &&
        glRef.current.getError() == glRef.current.CONTEXT_LOST_WEBGL) ||
        !glRef.current ||
        !programRef.current)
    ) {
      try {
        const newGl = setupWebGL(canvasRef.current, rowdy);
        glRef.current = newGl.gl;
        programRef.current = newGl.program;
        // if rowdy was changed, recreating the program will cause the image + uniforms to be reset.
        setFrame(animStateRef.current.frame ?? 0);
        setColorUniforms(
          glRef.current,
          programRef.current,
          colors,
          props.beastiedata.colors.length,
        );
      } catch (error) {
        if (error instanceof WebGLError) {
          console.log(`WebGL Error: ${error.message}`);
          setNoDisplayRender(true);
          setNoDisplayReason("Beastie Preview Failed");
          return;
        } else {
          throw error;
        }
      }
    }
  }, [colors, props.beastiedata.colors.length, rowdy, setFrame]);

  useEffect(() => {
    if (glRef.current && programRef.current) {
      setColorUniforms(
        glRef.current,
        programRef.current,
        colors,
        props.beastiedata.colors.length,
      );
    }
  }, [colors, props.beastiedata.colors.length]);

  const colorChange = useCallback(
    (change_index: number, color: number[]) => {
      setColors((old) => {
        return old.map((value, index) => {
          if (index == change_index) {
            return color;
          }
          return value;
        });
      });
    },
    [setColors],
  );

  const downloadImage = useCallback(
    (copy: boolean = false) => {
      if (!canvasRef.current || !cropCanvasRef.current) {
        return;
      }
      let canvas = canvasRef.current;
      const frame = animStateRef.current.frame;
      if (fitBeastie && frame != undefined) {
        const bbox = drawnsprite.bboxes[frame];
        if (!bbox) {
          return;
        }
        cropCanvasRef.current.width = bbox.width;
        cropCanvasRef.current.height = bbox.height;
        cropCanvasRef.current
          .getContext("2d")
          ?.drawImage(canvasRef.current, -bbox.x, -bbox.y);
        canvas = cropCanvasRef.current;
      }
      if (!copy) {
        const a = document.createElement("a");
        a.download = `${props.beastiedata.name}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      } else {
        canvas.toBlob((blob) => {
          if (!blob) {
            return;
          }
          navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        }, "image/png");
      }
    },
    [fitBeastie, drawnsprite, props.beastiedata.name],
  );

  const downloadGif = useCallback(() => {
    if (!glRef.current || !loadedImages || !animdata || !anim) {
      return;
    }
    saveGif(
      glRef.current,
      fitBeastie,
      `${props.beastiedata.name}_${animation}`,
      loadedImages,
      structuredClone(anim),
      userSpeed,
      animdata.__anim_speed ? animdata.__anim_speed : 1,
      drawnsprite,
      animStateRef.current.frame ?? 0,
    );
  }, [
    animation,
    fitBeastie,
    loadedImages,
    props.beastiedata.name,
    drawnsprite,
    anim,
    userSpeed,
    animdata,
  ]);

  const [background, setBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const animationAllowed: Record<string, boolean> = {};
  for (const value of ANIMATION_LIST) {
    animationAllowed[value] =
      value in animdata &&
      (ANIMATION_ALWAYS_SHOW.includes(value) ||
        (!isAnimEmpty(animdata[value]) &&
          (anim_check(value, props.beastiedata) == value || secrets)));
  }

  const gifDisabled = useMemo(() => {
    if (animdata && animdata[animation]) {
      const anim = animdata[animation];
      if (
        anim != undefined &&
        typeof anim != "number" &&
        typeof anim != "string"
      ) {
        if (anim.frames && !Array.isArray(anim.frames)) {
          if (anim.frames.startFrame === anim.frames.endFrame) {
            return true; // do not allow gifs of 1 frame animations
          }
        }
      }
    }
    for (let i = 0; i < beastiesprite.frames; i++) {
      if (loadedImages[i] === undefined) {
        return true;
      }
    }
    return false;
  }, [loadedImages, beastiesprite, animation, animdata]);

  const portrait = useScreenOrientation(800);
  const [previewOptionsVisible, setPreviewOptionsVisible] = useState(false);

  return (
    <div className={styles.preview}>
      <canvas ref={cropCanvasRef} style={{ display: "none" }} />
      <ImageContextMenu
        downloadImage={downloadImage}
        downloadGif={downloadGif}
        gifDisabled={gifDisabled}
        className={styles.canvascon}
        style={{
          backgroundImage: background ? "none" : "",
          backgroundColor: background ? backgroundColor : "transparent",
        }}
      >
        <canvas
          className={styles.previewcanvas}
          style={{
            display: noDisplayRender ? "none" : "block",
            transform: fitBeastie ? crop : "",
          }}
          width={1000}
          height={1000}
          ref={canvasRef}
        >
          Beastie Preview Image
        </canvas>
        <div
          className={styles.canvasfailed}
          style={{
            display: noDisplayRender ? "flex" : "none",
            backgroundColor: background ? backgroundColor : "transparent",
            color: background
              ? hexToRgb(backgroundColor).reduce<string>(
                  (accum, value) =>
                    accum + (255 - 255 * value).toString(16).padStart(2, "0"),
                  "#",
                )
              : "black",
          }}
        >
          <div>{noDisplayReason}</div>
        </div>
      </ImageContextMenu>

      <button
        className={styles.previewOptionsButton}
        onClick={() => setPreviewOptionsVisible((visible) => !visible)}
        style={{ display: portrait ? "block" : "none" }}
      >
        <span className={previewOptionsVisible ? "" : styles.upArrow}>V</span>{" "}
        Preview Options
      </button>

      <div
        className={
          previewOptionsVisible || !portrait
            ? styles.previewOptions
            : styles.previewOptionsNotVisible
        }
      >
        <AnimationOptions
          paused={paused}
          setPaused={setPaused}
          frameInputRef={frameInputRef}
          animation={animationState}
          setAnimation={setAnimation}
          animationAllowed={animationAllowed}
          frameCount={beastiesprite.frames}
          setFrame={setFrame}
          changeFrame={changeFrame}
          userSpeed={userSpeed}
          setUserSpeed={setUserSpeed}
          beastiedata={props.beastiedata}
          alt={alt}
          setAlt={setAlt}
        />

        <ColorTabs
          beastiedata={props.beastiedata}
          colorChange={colorChange}
          rowdy={rowdy}
          setRowdy={(value) => {
            setRowdy(value);
            glRef.current = null;
          }}
        />

        <PreviewSettings
          downloadImage={downloadImage}
          downloadGif={downloadGif}
          gifDisabled={gifDisabled}
          userSpeed={userSpeed}
          canvasRef={canvasRef}
          defaultSize={80}
          setBackground={setBackground}
          setBackgroundColor={setBackgroundColor}
          fitBeastie={fitBeastie}
          setFitBeastie={setFitBeastie}
        />
      </div>

      {import.meta.env.DEV ? (
        <Suspense fallback={<></>}>
          <DevUtil
            glRef={glRef}
            canvasRef={canvasRef}
            cropCanvasRef={cropCanvasRef}
            programRef={programRef}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
