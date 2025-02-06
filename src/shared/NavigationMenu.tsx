import { Link } from "react-router-dom";

import styles from "./NavigationMenu.module.css";
import NavIcons from "./NavIcons";

export function NavigationMenuOption(props: {
  text: string;
  image: string;
  hoverImage: string;
  location: string;
  target?: string;
}) {
  return (
    <Link
      className={styles.menulink}
      to={props.location}
      target={props.target ? props.target : "_self"}
    >
      <div className={styles.menuoption}>
        <div className={styles.images}>
          <img className={styles.hoverimage} src={props.hoverImage} />
          <img className={styles.image} src={props.image} />
        </div>
        <div className={styles.text}>{props.text}</div>
      </div>
    </Link>
  );
}

export function NavigationMenu(props: {
  children: React.ReactElement | React.ReactElement[];
  title?: string;
  note?: React.ReactNode;
}): React.ReactNode {
  return (
    <div className={styles.navmenu}>
      <div className={styles.sep}></div>
      <h1 className={styles.header}>
        {props.title ??
          (import.meta.env.VITE_EXPERIMENTAL == "true" ? "🧪 " : "") +
            import.meta.env.VITE_BRANDING}
      </h1>
      {props.note}
      <div className={styles.options}>{props.children}</div>
      <div className={styles.sep}></div>
      <div className={styles.footer}>
        <NavIcons />
      </div>
    </div>
  );
}
