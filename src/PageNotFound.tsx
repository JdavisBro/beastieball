import { useState } from "react";
import { Link } from "react-router-dom";

export default function PageNotFound(): React.ReactElement {
  const [col, setCol] = useState(Math.floor(Math.random() * 360));
  const [spr, setSpr] = useState(Math.floor(Math.random() * 127));

  function handleRandomize() {
    setCol(Math.floor(Math.random() * 360));
    setSpr(Math.floor(Math.random() * 127));
  }

  const style = {
    "--notfoundface-col": `hsl(${col}, 100%, 40%)`,
    "--notfoundface-spr": `url(/gameassets/sprEmoji/${spr}.png)`,
  } as React.CSSProperties;
  return (
    <div className="notfoundcontainer">
      <h1>Page Not Found</h1>
      <div
        className="notfoundfacecontainer"
        tabIndex={0}
        role="button"
        style={style}
        onClick={handleRandomize}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            handleRandomize();
          }
        }}
      >
        <div className="notfoundfacebg"></div>
        <div className="notfoundface"></div>
      </div>
      <h1>
        <Link to="/">Go to Home</Link>
      </h1>
    </div>
  );
}
