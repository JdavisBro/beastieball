import styles from "./Shared.module.css";
import githublogo from "../assets/github-mark-white.svg";

export default function ExternalLinks(): React.ReactElement {
  return (
    <div className={styles.externallinks}>
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/JdavisBro/beastieball"
      >
        <img
          className={styles.externallinklogo}
          src={githublogo}
          alt="GitHub Logo"
        />
      </a>
    </div>
  );
}
