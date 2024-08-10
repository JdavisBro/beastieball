import { useEffect, useState } from "react";

import styles from "./ResearchCarousel.module.css";
import Modal from "../../shared/Modal";
import untyped_research_data from "../../data/raw/research_data.json";

const research_data: { [key: string]: number } = untyped_research_data;

function Controls({
  imageIndex,
  changeIndex,
  totalImages,
}: {
  imageIndex: number;
  changeIndex: (targetIndex: number) => void;
  totalImages: number;
}) {
  return (
    <div className={styles.controls}>
      <button
        disabled={imageIndex == 0}
        onClick={() => changeIndex(imageIndex - 1)}
      >
        {"<"}Prev
      </button>
      {imageIndex + 1}/{totalImages}
      <button
        disabled={imageIndex == totalImages - 1}
        onClick={() => changeIndex(imageIndex + 1)}
      >
        Next{">"}
      </button>
    </div>
  );
}

export default function ResearchCarousel({ beastieid }: { beastieid: string }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [bigImage, setBigImage] = useState<boolean>(false);

  const images: { link: string; url: string }[] = [];
  for (let i = 0; i < research_data[beastieid]; i++) {
    images.push({
      link: `/gameassets/research/${beastieid}_${i}.png`,
      url: `/gameassets/research/${beastieid}_${i}.webp`,
    });
  }

  useEffect(() => {
    setImageIndex(0);
  }, [setImageIndex, beastieid]);

  const changeIndex = (targetIndex: number) => {
    setImageIndex(Math.min(Math.max(targetIndex, 0), images.length - 1));
  };

  const [biggerImage, setBiggerImage] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.curtains}>
        <div
          className={styles.stage}
          style={{ transform: `translateX(-${imageIndex * 100}%)` }}
        >
          {images.map((data, index) => (
            <img
              src={data.url}
              key={data.link}
              tabIndex={index == imageIndex ? 0 : -1}
              onClick={() => setBigImage(true)}
            />
          ))}
        </div>
      </div>
      <Controls
        imageIndex={imageIndex}
        changeIndex={changeIndex}
        totalImages={images.length}
      />
      <Modal
        header="Research"
        open={bigImage}
        onClose={() => {
          setBigImage(false);
          setBiggerImage(false);
        }}
      >
        <div className={styles.big}>
          {bigImage ? (
            <img
              className={biggerImage ? styles.biggerimage : styles.bigimage}
              src={images[imageIndex].link}
              onClick={() => setBiggerImage(!biggerImage)}
            />
          ) : null}
        </div>
        <Controls
          imageIndex={imageIndex}
          changeIndex={changeIndex}
          totalImages={images.length}
        />
      </Modal>
    </div>
  );
}
