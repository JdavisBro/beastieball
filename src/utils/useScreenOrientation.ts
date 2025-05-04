import { useState, useEffect, useCallback } from "react";

const getOrientation = (max_vertical_width?: number): boolean => {
  return (
    document.documentElement.clientWidth <
      document.documentElement.clientHeight &&
    (!max_vertical_width ||
      document.documentElement.clientWidth < max_vertical_width)
  );
};

// max vertical width: screens of width past this will no longer be considered vertical
const useScreenOrientation = (max_vertical_width?: number): boolean => {
  const [orientation, setOrientation] = useState(
    getOrientation(max_vertical_width),
  );

  const updateOrientation = useCallback(() => {
    setOrientation(getOrientation(max_vertical_width));
  }, [max_vertical_width]);

  useEffect(() => {
    window.addEventListener("resize", updateOrientation);
    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, [updateOrientation]);
  return orientation;
};

export default useScreenOrientation;
