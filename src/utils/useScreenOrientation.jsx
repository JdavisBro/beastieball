// @flow strict

import { useState, useEffect } from "react";

const getOrientation = (): boolean => {
  // eslint-disable-next-line no-undef
  return window.screen.height > window.screen.width;
};

const useScreenOrientation = (): boolean => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = () => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.addEventListener("resize", updateOrientation);
    return () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  return orientation;
};

export default useScreenOrientation;
