import { useCallback, useEffect, useRef, useState } from "react";

import setupWebGL, { WebGLError, setColorUniforms, setImage } from "./WebGL";
import styles from "../Content.module.css";
import type { BeastieType } from "../../data/BeastieType";
import vertex from "./vertex.glsl?raw";
import fragment from "./fragment.glsl?raw";
import ColorTabs from "./ColorTabs";
import SPRITE_INFO from "../../data/SpriteInfo";
import useLoadImages from "./useLoadImages";
import BEASTIE_ANIMATIONS from "../../data/BeastieAnimations";
import { hexToRgb } from "../../utils/color";

type Props = {
  beastiedata: BeastieType;
};

export default function ContentPreview(props: Props): React.ReactNode {
  const [colors, setColors] = useState<number[][]>([
    [30 / 255, 80 / 255, 69 / 255],
    [32 / 255, 33 / 255, 79 / 255],
    [52 / 255, 62 / 255, 64 / 255],
    [245 / 255, 208 / 255, 51 / 255],
    [220 / 255, 156 / 255, 0],
    [28 / 255, 84 / 255, 45 / 255],
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const [animation, setAnimation] = useState("idle");

  const loadedImages = useLoadImages(
    `/gameassets/beasties/${SPRITE_INFO[props.beastiedata.spr].name}`,
    SPRITE_INFO[props.beastiedata.spr].frames,
  );
  const requestRef = useRef(0);
  const frameIndexRef = useRef<number | null>(null); // if multiple beastieframe for animation
  const frameNumRef = useRef<number | null>(null);
  const frameTimeRef = useRef(0);
  const prevTimeRef = useRef<DOMHighResTimeStamp | null>(null);
  const holdRef = useRef<number | null>(null);

  const animPausedRef = useRef<boolean>(false);

  const frameInputRef = useRef<HTMLInputElement>(null);
  const pausedButtonRef = useRef<HTMLButtonElement>(null);

  const [noDisplayRender, setNoDisplayRender] = useState(false);
  const [noDisplayReasion, setNoDisplayReason] = useState(
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
              SPRITE_INFO[props.beastiedata.spr].frames,
              Math.max(0, frameNumRef.current + diff),
            )
          : 0,
      );
    },
    [setFrame, props.beastiedata],
  );

  const step = useCallback(
    (time: DOMHighResTimeStamp) => {
      const anims = BEASTIE_ANIMATIONS.get(
        `_${SPRITE_INFO[props.beastiedata.spr].name}`,
      );
      if (!anims || !anims.anim_data) {
        console.log(`No animation data found for ${props.beastiedata.name}`);
        return;
      }
      const anim = anims.anim_data[animation];
      if (
        anim === undefined ||
        typeof anim == "string" ||
        typeof anim == "number"
      ) {
        console.log(`Incorrect Anim: ${animation}`);
        setAnimation("idle");
        return;
      }
      const beastie_anim_speed =
        anims.anim_data.__anim_speed != undefined
          ? anims.anim_data.__anim_speed
          : 1;
      const anim_speed = anim.speed ? anim.speed : 1;
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
          if (loadedImages[startFrame]) {
            setImage(glRef.current, loadedImages[startFrame]);
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
      if (prevTimeRef.current && frameNumRef.current !== null) {
        const delta = time - prevTimeRef.current;
        if (!animPausedRef.current) {
          frameTimeRef.current += delta;
        }
        if (holdRef.current == null) {
          holdRef.current = 1;
          if (frames.holds && frames.holds[frameNumRef.current]) {
            const holds = frames.holds[frameNumRef.current];
            if (Array.isArray(holds)) {
              holdRef.current = holds[Math.floor(Math.random() * holds.length)];
            } else if (typeof holds == "number") {
              holdRef.current = holds;
            }
          }
        }
        const frameLength =
          (1000 / (24 * beastie_anim_speed) / anim_speed) * holdRef.current * 2; // idk multiplied by 2 seems to match in game more...
        if (frameTimeRef.current > frameLength) {
          frameTimeRef.current = frameTimeRef.current % frameLength;
          holdRef.current = null;
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
          if (glRef.current && loadedImages[frameNumRef.current]) {
            setImage(glRef.current, loadedImages[frameNumRef.current]);
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
    [loadedImages, props.beastiedata, animation],
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current);
  }, [step, animation]);

  useEffect(() => {
    frameIndexRef.current = null;
    frameNumRef.current = null;
    frameTimeRef.current = 0;
  }, [loadedImages]);

  useEffect(() => {
    if (
      canvasRef.current &&
      ((glRef.current &&
        glRef.current.getError() == glRef.current.CONTEXT_LOST_WEBGL) ||
        !glRef.current ||
        !programRef.current)
    ) {
      let newGl;
      try {
        newGl = setupWebGL(canvasRef.current, vertex, fragment, glRef.current);
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
      glRef.current = newGl.gl;
      programRef.current = newGl.program;
    }
  }, []);

  useEffect(() => {
    if (glRef.current && programRef.current) {
      setColorUniforms(glRef.current, programRef.current, colors);
    }
  }, [colors]);

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

  const beastiesprite = SPRITE_INFO[props.beastiedata.spr];

  const [fitBeastie, setFitBeastie] = useState(true);

  const downloadImage = useCallback(() => {
    if (!canvasRef.current || !cropCanvasRef.current) {
      return;
    }
    let canvas = canvasRef.current;
    if (fitBeastie && frameNumRef.current) {
      cropCanvasRef.current.width =
        beastiesprite.bboxes[frameNumRef.current].width;
      cropCanvasRef.current.height =
        beastiesprite.bboxes[frameNumRef.current].height;
      cropCanvasRef.current
        .getContext("2d")
        ?.drawImage(
          canvasRef.current,
          -beastiesprite.bboxes[frameNumRef.current].x,
          -beastiesprite.bboxes[frameNumRef.current].y,
        );
      canvas = cropCanvasRef.current;
    }
    const a = document.createElement("a");
    a.download = `${props.beastiedata.name}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, [fitBeastie, beastiesprite, props.beastiedata.name]);

  const [background, setBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const beastiescale =
    beastiesprite.bbox.width > beastiesprite.bbox.height
      ? beastiesprite.width / beastiesprite.bbox.width
      : beastiesprite.height / beastiesprite.bbox.height;

  const animationlist = [
    "idle",
    "move",
    "ready",
    "spike",
    "volley",
    "good",
    "bad",
    "fall",
    "stop",
  ];

  // Remove animations not in beastie
  const animdata = BEASTIE_ANIMATIONS.get(
    `_${SPRITE_INFO[props.beastiedata.spr].name}`,
  )?.anim_data;
  if (animdata) {
    animationlist.forEach((value, index) => {
      if (!(value in animdata)) {
        animationlist.splice(index, 1);
      }
    });
  }

  return (
    <div className={styles.preview}>
      <canvas ref={cropCanvasRef} style={{ display: "none" }} />
      <div className={styles.canvasconcon}>
        <div
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
              transform: fitBeastie
                ? `scale(${beastiescale}) translate(${((-beastiesprite.bbox.x - beastiesprite.bbox.width / 2 + beastiesprite.width / 2) / beastiesprite.width) * 100}%, ${((-beastiesprite.bbox.y - beastiesprite.bbox.height / 2 + beastiesprite.height / 2) / beastiesprite.height) * 100}%)`
                : "",
            }}
            width={1000}
            height={1000}
            ref={canvasRef}
          />
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
                : "white",
            }}
          >
            <div>{noDisplayReasion}</div>
          </div>
        </div>
      </div>

      <br />
      <div className={styles.header}>Animation</div>
      <div className={styles.varcontainer}>
        <div className={styles.value}>
          <select
            name="anim"
            id="anim"
            onChange={(event) => {
              animPausedRef.current = false;
              setAnimation(event.target.value);
            }}
            value={animation}
          >
            {animationlist.map((value: string) => (
              <option value={value} key={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
          <br />
          <button onClick={() => changeFrame(-1)}>{"<-"}</button>
          <button
            ref={pausedButtonRef}
            onClick={() => {
              animPausedRef.current = !animPausedRef.current;
            }}
          >
            PAUSE
          </button>
          <button onClick={() => changeFrame(1)}>{"->"}</button>
          <input
            ref={frameInputRef}
            type="number"
            min={0}
            max={SPRITE_INFO[props.beastiedata.spr].frames}
            onChange={(event) => {
              animPausedRef.current = true;
              setFrame(Number(event.target.value));
            }}
          />
        </div>
      </div>

      <ColorTabs beastiedata={props.beastiedata} colorChange={colorChange} />

      <div className={styles.header}>Settings</div>
      <div className={styles.varcontainer}>
        <div className={styles.value}>
          <button onClick={downloadImage}>Save PNG</button>
          <br />
          <div className={styles.middlealign}>
            <label htmlFor="sizeinput">Display Size: </label>
            <input
              name="sizeinput"
              id="sizeinput"
              type="range"
              min={25}
              max={100}
              step={5}
              defaultValue={100}
              onChange={(event) => {
                if (canvasRef.current && canvasRef.current.parentElement) {
                  canvasRef.current.parentElement.style.width = `${event.target.value}%`;
                }
              }}
            />
          </div>
          <div className={styles.middlealign}>
            <label htmlFor="whitebg" style={{ userSelect: "none" }}>
              Background:{" "}
            </label>
            <input
              name="whitebg"
              id="whitebg"
              type="checkbox"
              onChange={(event) => {
                setBackground(event.target.checked);
              }}
            />
            <input
              type="color"
              defaultValue={"#ffffff"}
              onChange={(event) => {
                setBackgroundColor(event.target.value);
              }}
            />
          </div>
          <label htmlFor="fitbeastie">Crop to Beastie</label>
          <input
            id="fitbeastie"
            name="fitbeastie"
            type="checkbox"
            defaultChecked={fitBeastie}
            onChange={(event) => {
              setFitBeastie(event.target.checked);
            }}
          />
        </div>
      </div>
    </div>
  );
}
