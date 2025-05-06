import { useState } from "react";

import TextTag from "./shared/TextTag";
import BeastieRenderProvider from "./shared/beastieRender/BeastieRenderProvider";
import { BeastieImage } from "./shared/beastieRender/BeastieImage";
import Tooltipped from "./shared/HoverTooltip/Tooltipped";

export default function Test(): React.ReactElement {
  const [text, setText] = useState(`size test:
[scale,5]5.0 times [sprIcon]
[scale,2.5]2.5 times [sprIcon]
[scale,0.5]0.5 times [sprIcon]
[/]font test
[ftBold]font test[/font]
color test: [#2cb18c]aqua[/c] [d#9346814]luncheon red
[slant]slant test[/slant]no slant test
[/]weird text tests[] with [[ ]t[[o]o!
`);

  return (
    <>
      <h1>HoverTooltip Test</h1>
      <Tooltipped tooltipId="test">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis
        obcaecati minima, doloribus eaque quos modi vero ullam, molestias harum
        incidunt provident, porro laborum odio ex maxime sint explicabo dicta
        necessitatibus dolor. Velit praesentium iste sed maxime qui, esse sint
        vel blanditiis consequatur amet quibusdam nesciunt aliquam neque et?
        Illo expedita quia rerum aliquam, perferendis obcaecati. Aspernatur
        fugit fuga reiciendis quae dolore sequi? Ex numquam illum possimus autem
        porro, quos quam natus provident totam modi minima dolore incidunt
      </Tooltipped>
      <br />
      <span>
        Bestie feels <Tooltipped tooltipId="tired">TIRED AND SHIT</Tooltipped>.
      </span>
      <h1>TextTag test</h1>
      <a href="https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Reference/Drawing/Colour_And_Alpha/Colour_And_Alpha.htm">
        Colors
      </a>{" "}
      -{" "}
      <a href="https://www.jujuadams.com/Scribble/#/latest/text-formatting">
        Tags (no effect tags)
      </a>
      <br />
      <div style={{ display: "flex", gap: "20px" }}>
        <textarea
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          style={{ resize: "horizontal", minHeight: "100%", width: "40%" }}
        />
        <TextTag>{text}</TextTag>
      </div>
      <h1>Beastie Rendering!!!</h1>
      <BeastieRenderProvider>
        <BeastieImage
          defaultUrl="/icons/Sprecko.png"
          beastie={{ id: "shroom1", colors: [0.5, 0.5, 0.5, 0.5] }}
        />
        <BeastieImage
          defaultUrl="/icons/Sprecko.png"
          beastie={{
            id: "shroom1",
            colors: [0.00001, 0.99999, 0.327746326569557, 0.5],
            colorAlt: "shiny",
          }}
        />
        <BeastieImage
          defaultUrl="/icons/Axolati.png"
          beastie={{ id: "frog1", colors: [0.1, 0.9, 0.5, 0.1] }}
        />
        <BeastieImage
          defaultUrl="/icons/Hopsong.png"
          beastie={{ id: "frog2", colors: [0.9, 0.1, 0.9, 0.5] }}
        />
        <BeastieImage
          defaultUrl="/icons/Bildit.png"
          beastie={{
            id: "bilby1",
            colors: [0.5, 0.5, 0.5, 0.5],
          }}
        />
      </BeastieRenderProvider>
      <Tooltipped tooltipId="test">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis
        obcaecati minima, doloribus eaque quos modi vero ullam, molestias harum
        incidunt provident, porro laborum odio ex maxime sint explicabo dicta
        necessitatibus dolor. Velit praesentium iste sed maxime qui, esse sint
        vel blanditiis consequatur amet quibusdam nesciunt aliquam neque et?
        Illo expedita quia rerum aliquam, perferendis obcaecati. Aspernatur
        fugit fuga reiciendis quae dolore sequi? Ex numquam illum possimus autem
        porro, quos quam natus provident totam modi minima dolore incidunt
      </Tooltipped>
    </>
  );
}
