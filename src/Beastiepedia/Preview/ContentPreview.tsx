import { useCallback, useEffect, useRef, useState } from "react";

import setupWebGL, { WebGLError, setColorUniforms, setImage } from "./WebGL";
import styles from "../Content.module.css";
import type { BeastieType } from "../../data/BeastieType";
import vertex from "./vertex.glsl?raw";
import fragment from "./fragment.glsl?raw";
import ColorTabs from "./ColorTabs";

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
  const [imageURL, setImageURL] = useState<string>(
    "/gameassets/sprDefaultbeastie/0.png",
  );

  const [renderFailed, setRenderFailed] = useState(false);

  useEffect(() => {
    setImageURL("/gameassets/sprDefaultbeastie/0.png");
  }, [props.beastiedata]);

  useEffect(() => {
    if (canvasRef.current) {
      let newGl;
      try {
        newGl = setupWebGL(canvasRef.current, vertex, fragment);
      } catch (error) {
        if (error instanceof WebGLError) {
          console.log(`WebGL Error: ${error.message}`);
          setRenderFailed(true);
          return;
        } else {
          throw error;
        }
      }
      glRef.current = newGl.gl;
      programRef.current = newGl.program;
      const im = new Image();
      im.src = imageURL;
      im.addEventListener("load", () => {
        if (glRef.current) {
          setImage(glRef.current, im);
          setRenderFailed(false);
        }
      });
    }
  }, [imageURL]);

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

  const downloadImage = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    const a = document.createElement("a");
    a.download = `${props.beastiedata.name}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  }, [props.beastiedata.name]);

  return (
    <div className={styles.preview}>
      <canvas
        className={styles.previewcanvas}
        style={{ display: renderFailed ? "none" : "block" }}
        width={1000}
        height={1000}
        ref={canvasRef}
      />
      <div
        className={styles.canvasfailed}
        style={{ display: renderFailed ? "flex" : "none" }}
      >
        <div>Beastie Preview Failed</div>
      </div>
      <button onClick={downloadImage}>Save PNG</button>
      <ColorTabs beastiedata={props.beastiedata} colorChange={colorChange} />
    </div>
  );
}
