import styles from "./Shared.module.css";

// https://www.jujuadams.com/Scribble/#/latest/text-formatting

let scale = 1;
const const_colors: { [key: string]: string } = {
  gray: "#808080",
};
const const_fonts: { [key: string]: string } = {
  Bold: "var(--sports-jersey)",
};

const rules: Array<{
  match: RegExp;
  replace: (matches: RegExpMatchArray) => React.ReactElement;
}> = [
  // spr (no index) usually this would animate through all frames but im not
  {
    match: /([\w\d]+)?\[(spr[\w\d]+?)(?:,(\d))?\]([\w\d]+)?/g,
    replace: (matches) => {
      return (
        <span>
          {doRule(matches[1]) ?? ""}
          <img
            className={styles.smallimage}
            src={`/gameassets/${matches[2]}/${matches[3] ?? "0"}.png`}
          />
          {doRule(matches[4]) ?? ""}
        </span>
      );
    },
  },
  {
    match: /(\[nbsp\])/g,
    replace: () => <> </>,
  },
  {
    match: /\[i\](.+?)(?:\[\/i\]|$)/g,
    replace: (matches) => <i>{doRule(matches[1])}</i>,
  },
  {
    match: /\[scaleStack,(.+?)\](.+?)(?=\[scaleStack,.+?\]|$)/g,
    replace: (matches) => {
      scale *= Number(matches[1]);
      return (
        <span style={{ fontSize: `${scale * 100}%` }}>
          {doRule(matches[2])}
        </span>
      );
    },
  },
  {
    match: /\[c_(.+?)\](.+?)(?:\[\/color]|\[\/colour]|\[\/c]|$)/g,
    replace: (matches) => {
      return (
        <span style={{ color: const_colors[matches[1]] }}>
          {doRule(matches[2])}
        </span>
      );
    },
  },
  {
    match: /\[ft(.+?)\](.+?)(?:\[\/font]|\[\/f]|$)/g,
    replace: (matches) => {
      return (
        <span style={{ fontFamily: const_fonts[matches[1]] }}>
          {doRule(matches[2])}
        </span>
      );
    },
  },
  {
    match: /\[\/.+?\]/g,
    replace: () => {
      return <></>;
    },
  },
];

type Props = {
  children: string;
};

function doRule(text: string): React.ReactElement[] {
  for (const rule of rules) {
    rule.match.lastIndex = 0;
    const elements: Array<React.ReactElement | string> = [];
    let match = rule.match.exec(text);
    if (match == null) {
      continue;
    }
    let i = 0;
    while (match != null) {
      if (i != match.index) {
        elements.push(text.substring(i, match.index));
      }
      const lastIndex = rule.match.lastIndex;
      elements.push(rule.replace(match));
      rule.match.lastIndex = lastIndex;

      i = match.index + match[0].length;
      match = rule.match.exec(text);
    }
    if (i != text.length) {
      elements.push(text.substring(i));
    }

    let newelements: React.ReactElement[] = [];
    elements.forEach((element) => {
      if (typeof element != "string") {
        newelements.push(element);
      } else {
        newelements = newelements.concat(doRule(element as string));
      }
    });

    return newelements;
  }
  return [<>{text}</>];
}

export default function TextTag(props: Props): React.ReactElement[] {
  const text = props.children;
  scale = 1;
  return doRule(text);
}
