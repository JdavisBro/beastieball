import styles from "../Shared.module.css";
type Props = {
  text: string;
};
export default function TextTag(props: Props): React.ReactElement[] {
  const text = props.text;
  const out: React.ReactElement[] = [];
  let tag = "";
  let value = "";
  let intag = false;
  let invalue = false;

  for (let i = 0; i < text.length; i++) {
    if (intag) {
      switch (text[i]) {
        case "]":
          intag = false;
          invalue = false;
          out.push(
            <img
              key={i}
              className={styles.smallimage}
              src={`/gameassets/${tag}/${value}.png`}
            />
          );
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
            out.push(<span key={i}>{value}</span>);
          }

          tag = "";
          value = "";
          intag = true;
          break;

        case "\n":
          if (value != "") {
            out.push(<span key={i}>{value}</span>);
          }

          out.push(<br key={i + 1} />);
          value = "";
          break;

        default:
          value += text[i];
      }
    }
  }

  if (value != "") {
    out.push(<span key={text.length}>{value}</span>);
  }

  return out;
}
