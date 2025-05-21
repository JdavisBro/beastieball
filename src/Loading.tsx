import { useEffect, useState } from "react";

const MAX_DOTS = 3;

export default function Loading(): React.ReactElement {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDots((value) => (value + 1) % (MAX_DOTS + 1)),
      1000,
    );
    return () => clearTimeout(timeout);
  });

  return (
    <div className="container">
      <div className="commoncontainer">
        <div className="loading animSelectableBackground">
          Loading{".".repeat(dots)}
          <span className="notvisible">{".".repeat(MAX_DOTS - dots)}</span>
        </div>
      </div>
    </div>
  );
}
