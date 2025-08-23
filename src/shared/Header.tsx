import { Link } from "react-router-dom";

import NavIcons from "./NavIcons";
import styles from "./Header.module.css";
import useLocalization from "../localization/useLocalization";

type Props = {
  title: string | undefined;
  menuButton?: boolean;
  menuButtonState?: boolean;
  onMenuButtonPressed?: () => void;
  returnButtonTo?: string;
  returnButtonTitle?: string;
};

export default function Header(props: Props): React.ReactNode {
  const { L, getLink } = useLocalization();

  const menuText = props.menuButtonState
    ? L("common.header.enabledMenu")
    : L("common.header.disabledMenu");
  return (
    <>
      <div className={styles.header}>
        {props.menuButton ? (
          <img
            className={
              props.menuButtonState ? styles.toggleicon : styles.toggleiconOff
            }
            src={"/gameassets/sprOptions_small_0.png"}
            title={menuText}
            alt={menuText}
            role="button"
            tabIndex={0}
            onClick={props.onMenuButtonPressed}
            // prettier-ignore
            onKeyDown={(event) => {if (event.key == "Enter" && props.onMenuButtonPressed) {props.onMenuButtonPressed()}}}
          />
        ) : null}
        <Link
          to={getLink(props.returnButtonTo ?? "/")}
          className={styles.homelink}
          title={L("common.header.return", {
            place:
              props.returnButtonTitle ??
              L("common.header.defaultPlace", {
                branding: import.meta.env.VITE_BRANDING,
              }),
          })}
        >
          <div className={styles.homeicon}></div>
        </Link>
        <div className={styles.title}>
          {import.meta.env.VITE_EXPERIMENTAL == "true"
            ? L("common.experimentalPrefix")
            : ""}
          {props.title}
        </div>
        <div className={styles.externallinkcontainer}>
          <NavIcons />
        </div>
      </div>
      <div className={styles.staticheader}></div>
    </>
  );
}
