import { Fragment } from "react/jsx-runtime";
import { bgrDecimalToHex } from "../utils/color";
import styles from "./Shared.module.css";

// https://www.jujuadams.com/Scribble/#/latest/text-formatting
// effects not added

const IMAGE_ALTS: Record<string, Record<number, string>> = {
  sprIcon: { 0: "Body", 1: "Spirit", 2: "Mind" },
  sprBoost: {
    0: "1 up arrow boost",
    1: "2 up arrow boost",
    2: "3 up arrow boost",
    3: "1 down arrow boost",
    4: "2 down arrow boost",
    5: "3 down arrow boost",
  },
};

const ALT_EXCEPTIONS: string[] = ["sprStatus"];

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
  textShadow: undefined,
};

const ANIMATIONS: { [key: string]: string } = {
  wave: `0.8s linear 0s infinite alternate ${styles.wave}`,
  shake: `0.4s linear 0s infinite normal ${styles.shake}`,
  blink: `1s linear 0s infinite normal ${styles.blink}`,
};

class TagBuilder {
  elements: React.ReactElement[] = [];
  style: React.CSSProperties = { ...DEFAULT_STYLE };
  animations: string[] = [];

  applyTag(index: number, tag: string, value?: string) {
    if (tag.startsWith("spr")) {
      const alt =
        tag in IMAGE_ALTS
          ? IMAGE_ALTS[tag][Number(value ?? 0)] ?? undefined
          : undefined;
      if (!alt && !ALT_EXCEPTIONS.includes(tag)) {
        console.log(`NO ALT TEXT: '${tag}' frame ${value}`);
      }
      this.elements.push(
        <img
          key={`${index}${tag}`}
          className={styles.smallimage}
          style={{ ...this.style }}
          alt={alt}
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
      this.style.color = `#${bgrDecimalToHex(Number(tag.substring(2)))}`;
      return;
    }

    const ending = tag.startsWith("/");
    const animtag = ending ? tag.slice(1) : tag;
    if (animtag in ANIMATIONS) {
      if (!ending && !this.animations.includes(ANIMATIONS[animtag])) {
        this.animations.push(ANIMATIONS[animtag]);
      } else if (ending && this.animations.includes(ANIMATIONS[animtag])) {
        this.animations.splice(this.animations.indexOf(ANIMATIONS[animtag]), 1);
      }
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
      case "shadow": // might not be real BUT i think it is??
        this.style.textShadow = "black 1px 1px";
        break;
      case "/shadow":
        this.style.textShadow = undefined;
        break;
      default:
        console.log(`Tag Not Implemented ${tag}: ${value}`);
        break;
    }
  }

  addText(index: number, text: string) {
    this.elements.push(
      <span
        key={String(index)}
        style={{ animation: this.animations.join(", "), ...this.style }}
      >
        {text.split("\n").map((value, index) =>
          index == 0 ? (
            <Fragment key={index}>{value}</Fragment>
          ) : (
            <Fragment key={index}>
              <br />
              {value}
            </Fragment>
          ),
        )}
      </span>,
    );
  }
}

export function tagEscape(
  text: string | Array<string | number | undefined | null>,
) {
  return (Array.isArray(text) ? text.join("") : text).replace(
    /(\[{1,2})/g,
    "$1$1",
  );
}

type Props = {
  children: string | Array<string | number | undefined | null>;
};

export default function TextTag(props: Props): React.ReactElement {
  let text;
  if (Array.isArray(props.children)) {
    text = props.children.join("");
  } else {
    text = props.children;
  }
  const builder = new TagBuilder();
  // gets text before next tag or end of string (match[1]) (match[2] is [ when [[) + next tag (match[3]) + value (match[4])
  const regex = /([^[]*?)?(?:\[(?:\]|$)|\[(?:(\[)|$)|\[(.+?)(?:,(.+?))?\]|$)/g;
  let match = regex.exec(text);
  let i = 0;
  let combine = "";
  // match[0] will always be an empty string even at the end of the text
  while (match != null && match.some((value) => !!value)) {
    const current_text = match[1] ?? "";
    const escape_bracket = match[2] ?? "";
    const tag = match[3];
    const value = match[4];
    if (current_text || escape_bracket) {
      if (!tag) {
        // tag not changed (e.g only escape bracket) so combine with next match to reduce span tags
        combine += current_text + escape_bracket;
        i += current_text.length + escape_bracket.length;
      } else {
        builder.addText(i, combine + current_text + escape_bracket);
        combine = "";
        i += current_text.length + escape_bracket.length;
      }
    }
    if (tag) {
      builder.applyTag(i, tag, value);
      i += tag.length + (value?.length ?? 0);
    }
    match = regex.exec(text);
  }
  if (combine) {
    builder.addText(i, combine);
  }
  return <span className={styles.texttag}>{builder.elements}</span>;
}
