import { useState, useEffect } from "react";

const getOrientation = (): boolean => {
  return window.screen.height > window.screen.width;
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
