import styles from "./Shared.module.css";

type Props = {
  children: string;
};

// Only sprite viewing is here rn but if any tags are added they're probably desribed here
// https://www.jujuadams.com/Scribble/#/latest/text-formatting

export default function TextTag(props: Props): React.ReactElement[] {
  const text = props.children;
  const out: React.ReactElement[] = [];
  let tag = "";
  let value = "";
  let intag = false;
  let invalue = false;
  let nobreak = false;
  let nobreakelem: React.ReactElement[] = [];

  function addSpan(i: number, endbreak = false) {
    if (nobreak) {
      if (value != "") {
        nobreakelem.push(<span key={i}>{value}</span>);
      }
      if (endbreak) {
        nobreak = false;
        value = "";
        out.push(
          <span className={styles.texttagnobreak} key={i}>
            {nobreakelem}
          </span>,
        );
      }
    } else {
      if (value != "") {
        out.push(<span key={i}>{value}</span>);
      }
    }
  }

  for (let i = 0; i < text.length; i++) {
    if (intag) {
      switch (text[i]) {
        case "]":
          intag = false;
          invalue = false;
          if (nobreak || (i + 1 != text.length && text[i + 1] != " ")) {
            // no space between img and the next text
            if (!nobreak) {
              nobreakelem = [];
            }
            nobreak = true;
            nobreakelem.push(
              <img
                key={i}
                className={styles.smallimage}
                src={`/gameassets/${tag}/${value}.png`}
              />,
            );
          } else {
            out.push(
              <img
                key={i}
                className={styles.smallimage}
                src={`/gameassets/${tag}/${value}.png`}
              />,
            );
          }
          value = "";
          break;

        case ",":
          invalue = true;
          break;

        default:
          if (!invalue) {
            tag += text[i];
          } else {
            value += text[i];
          }
      }
    } else {
      switch (text[i]) {
        case "[":
          if (value != "") {
            addSpan(i);
          }

          tag = "";
          value = "";
          intag = true;
          break;

        case "\n":
          addSpan(i, true);

          out.push(<br key={i + 1} />);
          value = "";
          break;

        case " ":
          if (nobreak) {
            addSpan(i, true);
          }
          value += text[i];
          break;
        default:
          value += text[i];
      }
    }
  }

  if (value != "") {
    addSpan(text.length, true);
  }

  return out;
}
