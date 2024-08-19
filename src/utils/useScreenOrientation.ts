import { useState, useEffect } from "react";

const getOrientation = (): boolean => {
  return (
    document.documentElement.clientWidth < document.documentElement.clientHeight
  );
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
