import { Link } from "react-router-dom";

// import styles from "./Home.module.css";

export default function Home(): React.ReactNode {
  return (
    <div>
      <h1>Home</h1>
      <h1>
        <Link to="/beastiepedia/">Beastiepedia</Link>
      </h1>
    </div>
  );
}
