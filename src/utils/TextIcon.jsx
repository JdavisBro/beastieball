// @flow strict

import styles from "../Shared.module.css";

export default function TextIcon({ text }): React$Node {
  var out = [];
  var tag = "";
  var value = "";
  var intag = false;
  var invalue = false;
  for (var i = 0; i < text.length; i++) {
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
          break; // do tag handling
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
      if (text[i] != "[") {
        value += text[i];
      } else {
        out.push(<span key={i}>{value}</span>);
        tag = "";
        value = "";
        intag = true;
      }
    }
  }
  if (value != "") {
    out.push(<span key={i}>{value}</span>);
  }
  return out;
}
