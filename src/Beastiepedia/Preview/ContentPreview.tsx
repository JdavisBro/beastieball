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
import SPRITE_INFO, { BBox, Sprite } from "../../data/SpriteInfo";
import useLoadBeastieImages from "../../utils/useLoadBeastieImages";
import BEASTIE_ANIMATIONS, {
  BeastieAnimation,
  BeastieAnimData,
} from "../../data/BeastieAnimations";
import { hexToRgb } from "../../utils/color";
import saveGif from "./saveGif";
import AnimationOptions from "./AnimationOptions";
import PreviewSettings from "./PreviewSettings";
import useScreenOrientation from "../../utils/useScreenOrientation";

const DevUtil = import.meta.env.DEV
  ? lazy(() => import("./DevUtil.tsx"))
  : () => null;

type Props = {
  beastiedata: BeastieType;
};

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
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const [animation, setAnimation] = useState("idle");
  const animdata: BeastieAnimData | undefined = BEASTIE_ANIMATIONS.get(
    `_${props.beastiedata.spr}`,
  )?.anim_data as BeastieAnimData;

  let anim: BeastieAnimation | undefined = undefined;
  const tempanim = animdata ? animdata[animation] : undefined;
  if (
    tempanim != undefined &&
    typeof tempanim != "number" &&
    typeof tempanim != "string"
  ) {
    anim = tempanim;
  }

  const loadedImages = useLoadBeastieImages(
    `/gameassets/beasties/${drawnname}`,
    beastiesprite.frames,
  );
  const requestRef = useRef(0);
  const frameIndexRef = useRef<number | null>(null); // if multiple beastieframe for animation
  const frameNumRef = useRef<number | null>(null);
  const frameTimeRef = useRef(0);
  const prevTimeRef = useRef<DOMHighResTimeStamp | null>(null);
  const frameLengthRef = useRef<number | null>(null);

  const animPausedRef = useRef<boolean>(false);

  const frameInputRef = useRef<HTMLInputElement>(null);
  const pausedButtonRef = useRef<HTMLButtonElement>(null);

  const [noDisplayRender, setNoDisplayRender] = useState(false);
  const [noDisplayReason, setNoDisplayReason] = useState(
    "Beastie Preview Failed",
  );

  const setFrame = useCallback(
    (frame: number) => {
      frameNumRef.current = frame;
      if (glRef.current && loadedImages[frame]) {
        setImage(glRef.current, loadedImages[frame]);
        setNoDisplayRender(false);
      }
    },
    [loadedImages],
  );

  const changeFrame = useCallback(
    (diff: number) => {
      animPausedRef.current = true;
      setFrame(
        frameNumRef.current != null
          ? Math.min(
              beastiesprite.frames - 1,
              Math.max(0, frameNumRef.current + diff),
            )
          : 0,
      );
    },
    [setFrame, beastiesprite],
  );

  const [userSpeed, setUserSpeed] = useState(1);

  const getCrop = useCallback(
    (bbox: BBox) => {
      const beastiescale =
        bbox.width > bbox.height
          ? drawnsprite.width / bbox.width
          : drawnsprite.height / bbox.height;
      return `scale(${beastiescale}) translate(${((-bbox.x - bbox.width / 2 + drawnsprite.width / 2) / drawnsprite.width) * 100}%, ${((-bbox.y - bbox.height / 2 + drawnsprite.height / 2) / drawnsprite.height) * 100}%)`;
    },
    [drawnsprite],
  );

  const getAnimBboxAndLoaded = useCallback(() => {
    if (!anim || animPausedRef.current) {
      return { bbox: getCrop(drawnsprite.bbox), loaded: false };
    }
    let bbox: { x: number; y: number; endx: number; endy: number } | undefined =
      undefined;
    const frames = Array.isArray(anim.frames) ? anim.frames : [anim.frames];
    let allFramesLoaded = true;
    for (const state of frames) {
      const startFrame = state.startFrame || 0;
      const endFrame = state.endFrame || 0;
      for (let i = startFrame; i <= endFrame; i++) {
        if (!loadedImages[i % drawnsprite.frames]) {
          allFramesLoaded = false;
        }
        const framebbox = drawnsprite.bboxes[i % drawnsprite.frames];
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
    }
    if (!bbox) {
      return { bbox: getCrop(drawnsprite.bbox), loaded: allFramesLoaded };
    }
    return {
      bbox: getCrop({
        x: bbox.x,
        y: bbox.y,
        width: bbox.endx - bbox.x,
        height: bbox.endy - bbox.y,
      }),
      loaded: allFramesLoaded,
    };
  }, [drawnsprite, getCrop, anim, loadedImages]);

  const [fitBeastie, setFitBeastie] = useState(true);

  const step = useCallback(
    (time: DOMHighResTimeStamp) => {
      const { bbox, loaded } = getAnimBboxAndLoaded();
      if (fitBeastie && canvasRef.current)
        canvasRef.current.style.transform = bbox;
      if (anim === undefined) {
        console.log(`Incorrect Anim: ${animation}`);
        setAnimation("idle");
        return;
      }
      const beastie_anim_speed = animdata.__anim_speed ?? 1;
      const anim_speed = anim.speed ?? 1;
      let frames;
      if (!Array.isArray(anim.frames)) {
        frameIndexRef.current = null;
        frames = anim.frames;
      }
      if (Array.isArray(anim.frames)) {
        if (
          frameIndexRef.current === null ||
          frameIndexRef.current > anim.frames.length
        ) {
          frameIndexRef.current = 0;
        }
        frames = anim.frames[frameIndexRef.current];
      }
      if (frames == undefined) {
        console.log(`No Frames? ${props.beastiedata.name} ${animation}`);
        return;
      }
      let startFrame = 0;
      let endFrame = 0;
      if (frames.startFrame != undefined) {
        startFrame = frames.startFrame;
        endFrame = frames.startFrame;
      }
      if (frames.endFrame != undefined) {
        endFrame = frames.endFrame;
      }
      if (
        frameNumRef.current === null ||
        (frameNumRef.current < startFrame && !animPausedRef.current)
      ) {
        if (glRef.current) {
          if (loadedImages[startFrame % beastiesprite.frames]) {
            setImage(
              glRef.current,
              loadedImages[startFrame % beastiesprite.frames],
            );
            frameNumRef.current = startFrame;
            setNoDisplayRender(false);
          } else if (loadedImages[0]) {
            setImage(glRef.current, loadedImages[0]);
            frameNumRef.current = 0;
            setNoDisplayRender(false);
          } else {
            setNoDisplayRender(true);
            setNoDisplayReason("Loading...");
          }
        }
      }
      if (prevTimeRef.current && frameNumRef.current !== null && loaded) {
        const delta = time - prevTimeRef.current;
        if (!animPausedRef.current) {
          frameTimeRef.current += delta;
        }
        if (frameLengthRef.current == null) {
          let hold = 2;
          if (frames.holds && frames.holds[frameNumRef.current]) {
            const holds = frames.holds[frameNumRef.current];
            if (Array.isArray(holds)) {
              hold = holds[Math.floor(Math.random() * holds.length)];
            } else if (typeof holds == "number") {
              hold = holds;
            }
          }
          frameLengthRef.current =
            (1000 / (24 * beastie_anim_speed * anim_speed)) * hold;
        }
        if (frameTimeRef.current > frameLengthRef.current / userSpeed) {
          if (frameLengthRef.current > 0) {
            frameTimeRef.current =
              frameTimeRef.current % frameLengthRef.current;
          }
          frameLengthRef.current = null;
          frameNumRef.current += 1;
          if (frameNumRef.current > endFrame) {
            if (frames.transitions && Array.isArray(anim.frames)) {
              frameIndexRef.current =
                frames.transitions[
                  Math.floor(Math.random() * frames.transitions.length)
                ];
              const newstart = anim.frames[frameIndexRef.current].startFrame;
              if (newstart != null) {
                frameNumRef.current = newstart;
              } else {
                frameNumRef.current = 0;
              }
            } else {
              frameNumRef.current = startFrame;
            }
          }
          const frameN = frameNumRef.current % beastiesprite.frames;
          if (glRef.current && loadedImages[frameN]) {
            setImage(glRef.current, loadedImages[frameN]);
            setNoDisplayRender(false);
          }
        }
      }
      if (frameInputRef.current)
        frameInputRef.current.value = String(frameNumRef.current);
      if (pausedButtonRef.current)
        pausedButtonRef.current.innerText = animPausedRef.current
          ? "PLAY"
          : "PAUSE";
      prevTimeRef.current = time;
      requestRef.current = requestAnimationFrame(step);
    },
    [
      loadedImages,
      props.beastiedata,
      animation,
      anim,
      animdata,
      userSpeed,
      getAnimBboxAndLoaded,
      fitBeastie,
      beastiesprite,
    ],
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current);
  }, [step, animation]);

  useEffect(() => {
    frameIndexRef.current = null;
    frameNumRef.current = null;
    frameTimeRef.current = 0;
  }, [loadedImages, animation]);

  useEffect(() => {
    if (
      canvasRef.current &&
      ((glRef.current &&
        glRef.current.getError() == glRef.current.CONTEXT_LOST_WEBGL) ||
        !glRef.current ||
        !programRef.current)
    ) {
      try {
        const newGl = setupWebGL(canvasRef.current);
        glRef.current = newGl.gl;
        programRef.current = newGl.program;
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
  }, []);

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
      if (fitBeastie && frameNumRef.current !== null) {
        cropCanvasRef.current.width =
          drawnsprite.bboxes[frameNumRef.current].width;
        cropCanvasRef.current.height =
          drawnsprite.bboxes[frameNumRef.current].height;
        cropCanvasRef.current
          .getContext("2d")
          ?.drawImage(
            canvasRef.current,
            -drawnsprite.bboxes[frameNumRef.current].x,
            -drawnsprite.bboxes[frameNumRef.current].y,
          );
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
      frameNumRef.current != undefined ? frameNumRef.current : 0,
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

  const animationList = [
    "idle",
    "move",
    "ready",
    "spike",
    "volley",
    "good",
    "bad",
    "fall",
    "air",
    "stop",
    "menu",
  ];

  // Remove animations not in beastie
  if (animdata) {
    animationList.forEach((value, index) => {
      if (!(value in animdata)) {
        animationList.splice(index, 1);
      }
    });
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

  const portrait = useScreenOrientation();
  const [previewOptionsVisible, setPreviewOptionsVisible] = useState(!portrait);

  return (
    <div className={styles.preview}>
      <canvas ref={cropCanvasRef} style={{ display: "none" }} />
      <div
        className={styles.canvascon}
        style={{
          backgroundImage: background ? "none" : "",
          backgroundColor: background ? backgroundColor : "transparent",
          width: portrait ? "70%" : "80%",
        }}
      >
        <canvas
          className={styles.previewcanvas}
          style={{
            display: noDisplayRender ? "none" : "block",
            transform: fitBeastie ? getCrop(beastiesprite.bbox) : "",
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
      </div>

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
          animPausedRef={animPausedRef}
          pausedButtonRef={pausedButtonRef}
          frameInputRef={frameInputRef}
          animation={animation}
          setAnimation={setAnimation}
          animationList={animationList}
          frameCount={beastiesprite.frames}
          setFrame={setFrame}
          changeFrame={changeFrame}
          userSpeed={userSpeed}
          setUserSpeed={setUserSpeed}
          beastiedata={props.beastiedata}
          alt={alt}
          setAlt={setAlt}
        />

        <ColorTabs beastiedata={props.beastiedata} colorChange={colorChange} />

        <PreviewSettings
          downloadImage={downloadImage}
          downloadGif={downloadGif}
          gifDisabled={gifDisabled}
          userSpeed={userSpeed}
          canvasRef={canvasRef}
          defaultSize={portrait ? 70 : 80}
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
