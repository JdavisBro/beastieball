import styles from "./Shared.module.css";
import githublogo from "../assets/github-mark-white.svg";

export default function ExternalLinks(): React.ReactElement {
  return (
    <a target="_blank" href="https://github.com/jdavisBro/beastieball">
      <img
        className={styles.externallinklogo}
        src={githublogo}
        alt="GitHub Logo"
      />
    </a>
  );
}
