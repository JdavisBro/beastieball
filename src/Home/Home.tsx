import { Link } from "react-router-dom";

import styles from "./Home.module.css";
import ExternalLinks from "../shared/ExternalLinks";
import AnimationToggle from "../shared/AnimationToggle";

function MenuOption(props: {
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

export default function Home(): React.ReactNode {
  return (
    <div className={styles.home}>
      <div className={styles.sep}></div>
      <h1 className={styles.header}>Beastieball Info</h1>
      <div className={styles.options}>
        <MenuOption
          text={"Beastiepedia"}
          image={"/gameassets/sprMainmenu/0.png"}
          hoverImage={"/gameassets/sprMainmenu/1.png"}
          location={"/beastiepedia/"}
        />
        <MenuOption
          text={"The Game"}
          image={"/gameassets/sprMainmenu/6.png"}
          hoverImage={"/gameassets/sprMainmenu/7.png"}
          location={"https://beastieballgame.com"}
          target="_blank"
        />
        <MenuOption
          text={"Map"}
          image={"/gameassets/sprMainmenu/2.png"}
          hoverImage={"/gameassets/sprMainmenu/3.png"}
          location={"/map/"}
        />
      </div>
      <div className={styles.sep}></div>
      <div className={styles.footer}>
        <AnimationToggle />
        <ExternalLinks />
      </div>
    </div>
  );
}
