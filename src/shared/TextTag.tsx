import { bgrDecimalToHex } from "../utils/color";
import styles from "./Shared.module.css";

// https://www.jujuadams.com/Scribble/#/latest/text-formatting
// effects not added

const COLORS: { [key: string]: string } = {
  c_aqua: "#00ffff",
  c_black: "#000000",
  c_blue: "#0000ff",
  c_dkgray: "#404040",
  c_fuchsia: "#ff00ff",
  c_gray: "#808080",
  c_green: "#008000",
  c_lime: "#00ff00",
  c_ltgray: "#c0c0c0",
  c_maroon: "#800000",
  c_navy: "#000080",
  c_olive: "#808000",
  c_orange: "#ffa040",
  c_purple: "#800080",
  c_red: "#ff0000",
  c_silver: "#c0c0c0",
  c_teal: "#008080",
  c_white: "#ffffff",
  c_yellow: "#ffff00",
};

const FONTS: { [key: string]: string } = {
  ftBold: "var(--sports-jersey)",
};

const DEFAULT_STYLE: React.CSSProperties = {
  fontSize: undefined,
  fontStyle: undefined,
  fontFamily: undefined,
  color: undefined,
  opacity: undefined,
};

class TagBuilder {
  elements: React.ReactElement[] = [];
  style: React.CSSProperties = { ...DEFAULT_STYLE };

  applyTag(index: number, tag: string, value?: string) {
    if (tag.startsWith("spr")) {
      this.elements.push(
        <img
          key={`${index}${tag}`}
          className={styles.smallimage}
          style={{ ...this.style }}
          src={`/gameassets/${tag}/${value ?? "0"}.png`}
        />,
      );
      return;
    }
    if (tag.startsWith("ft")) {
      this.style.fontFamily = FONTS[tag];
      return;
    }
    if (tag.startsWith("c_")) {
      this.style.color = COLORS[tag];
      return;
    }
    if (tag.startsWith("#")) {
      this.style.color = tag;
      return;
    }
    if (tag.startsWith("d#")) {
      this.style.color = bgrDecimalToHex(Number(tag.substring(2)));
      return;
    }

    switch (tag) {
      case "/":
        this.style = { ...DEFAULT_STYLE };
        break;
      case "/font":
        this.style.fontFamily = undefined;
        break;
      case "/c":
      case "/color":
      case "/colour":
        this.style.color = undefined;
        break;
      case "scale":
        this.style.fontSize = `${Number(value ?? 1) * 100}%`;
        break;
      case "scaleStack":
        this.style.fontSize =
          typeof this.style.fontSize == "string"
            ? `${
                Number(
                  this.style.fontSize.substring(
                    0,
                    this.style.fontSize.length - 1,
                  ),
                ) * Number(value)
              }%`
            : `${Number(value) * 100}%`;
        break;
      case "/scale":
      case "/s":
        this.style.fontSize = undefined;
        break;
      case "slant":
        this.style.fontStyle = "italic";
        break;
      case "/slant":
        this.style.fontStyle = undefined;
        break;
      case "alpha":
        this.style.opacity = Number(value ?? 1);
        break;
      case "/alpha":
        this.style.opacity = undefined;
        break;
      default:
        console.log(`Tag Not Implemented ${tag}: ${value}`);
        break;
    }
  }

  addText(index: number, text: string) {
    this.elements.push(
      <span key={String(index)} style={{ ...this.style }}>
        {text}
      </span>,
    );
  }
}

type Props = {
  children: string;
};

export default function TextTag(props: Props): React.ReactElement {
  const text = props.children;
  const builder = new TagBuilder();
  // gets text before next tag or end of string (match[1]) + next tag (match[2]) + value (match[3])
  const regex = /([^[]*?)?(?:\[(.+?)(?:,(.+?))?\]|$)/g;
  let match = regex.exec(text);
  let i = 0;
  while (match != null && match.some((value) => !!value)) {
    if (match[1]) {
      builder.addText(i, match[1]);
      i += match[1].length;
    }
    if (match[2]) {
      builder.applyTag(i, match[2], match[3]);
      i += match[2].length + (match[3]?.length ?? 0);
    }
    match = regex.exec(text);
  }
  return <span className={styles.texttag}>{builder.elements}</span>;
}
