import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";

export default function Home(): React.ReactNode {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Home</h1>
      <h1
        className={styles.url}
        onClick={useCallback(() => {
          navigate("/beastiepedia/");
        }, [navigate])}
      >
        Beastiepedia
      </h1>
    </div>
  );
}
