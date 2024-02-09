import { useCallback, useEffect, useRef, useState } from "react";

import setupWebGL, { setColorUniforms, setImage } from "./WebGL";
import {getColorInBeastieColors, hexToRgb} from "../../utils/color"; 
import styles from "../Content.module.css";
import type { BeastieType } from "../../data/BeastieType";
import vertex from "./vertex.glsl?raw";
import fragment from "./fragment.glsl?raw";
import ColorTabs from "./ColorTabs";

type Props = {
  beastiedata: BeastieType;
};

export default function ContentPreview(props: Props): React.ReactNode {
  const beastiedata = props.beastiedata;

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

  useEffect(() => {
    if (canvasRef.current) {
      var newGl = setupWebGL(canvasRef.current, vertex, fragment);
      glRef.current = newGl.gl;
      programRef.current = newGl.program;
      var im = new Image();
      im.src = "/gameassets/sprDefaultbeastie/0.png";
      im.addEventListener("load", () => {
        if (glRef.current) {
          setImage(glRef.current, im);
        }
      });
    }
  }, [canvasRef.current]);

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

  return (
    <div className={styles.preview}>
      <div className={styles.inner}>{beastiedata.name}</div>
      <canvas
        className={styles.previewcanvas}
        width={1000}
        height={1000}
        ref={canvasRef}
      />
      <ColorTabs beastiedata={props.beastiedata} colorChange={colorChange} />
    </div>
  );
}
