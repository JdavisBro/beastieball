import { useState, useEffect } from "react";

const getOrientation = (): boolean => {
  // return window.screen.width / window.screen.height <= 4 / 6;
  return window.screen.width > window.screen.height;
};

const useScreenOrientation = (): boolean => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = () => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.addEventListener("resize", updateOrientation);
    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);
  return orientation;
};

export default useScreenOrientation;
