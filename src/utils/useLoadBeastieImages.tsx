import { useEffect, useRef, useState } from "react";

type Image = {
  src: string;
  image?: HTMLImageElement;
  onLoad?: (event: Event) => void;
};

export default function useLoadBeastieImages(path: string, max_num: number) {
  const [loaded, setLoaded] = useState<{ [key: number]: HTMLImageElement }>({});
  const images = useRef<{ [key: number]: Image }>({});

  useEffect(() => {
    for (let i = 0; i < max_num; i++) {
      const imElem = document.createElement("img");
      const imOnLoad = () => {
        setLoaded((loaded) => {
          return {
            ...loaded,
            [i]: imElem,
          };
        });
      };
      const image: Image = {
        src: `${path}/${i}.png`,
        image: imElem,
        onLoad: imOnLoad,
      };
      imElem.addEventListener("load", imOnLoad);
      imElem.src = image.src;
      images.current[i] = image;
    }

    return () => {
      for (let i = 0; i < max_num; i++) {
        const currentIm = images.current[i];
        if (currentIm.image && currentIm.onLoad) {
          currentIm.image.removeEventListener("load", currentIm.onLoad);
        }
      }
      setLoaded({});
      images.current = {};
    };
  }, [path, max_num]);

  return loaded;
}
