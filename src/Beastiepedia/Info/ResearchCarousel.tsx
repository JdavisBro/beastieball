import { useEffect, useState } from "react";
import styles from "./ResearchCarousel.module.css";
import Modal from "../../shared/Modal";

export default function ResearchCarousel({
  images,
}: {
  images: { url: string; link: string }[];
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [bigImage, setBigImage] = useState<boolean>(false);

  useEffect(() => {
    setImageIndex(0);
  }, [setImageIndex, images]);

  const changeIndex = (target_index: number) => {
    setImageIndex(Math.min(Math.max(target_index, 0), images.length - 1));
  };

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
      <div className={styles.controls}>
        <button
          disabled={imageIndex == 0}
          onClick={() => changeIndex(imageIndex - 1)}
        >
          {"<"}Prev
        </button>
        {imageIndex + 1}/{images.length}
        <button
          disabled={imageIndex == images.length - 1}
          onClick={() => changeIndex(imageIndex + 1)}
        >
          Next{">"}
        </button>
      </div>
      <Modal
        header="Research"
        open={bigImage}
        onClose={() => setBigImage(false)}
      >
        <div className={styles.big}>
          <button
            disabled={imageIndex == 0}
            onClick={() => changeIndex(imageIndex - 1)}
          >
            {"<"}Prev
          </button>
          <div className={styles.bigimagecon}>
            {bigImage ? (
              <img className={styles.bigimage} src={images[imageIndex].link} />
            ) : null}
            <div>
              {imageIndex + 1}/{images.length}
            </div>
          </div>
          <button
            disabled={imageIndex == images.length - 1}
            onClick={() => changeIndex(imageIndex + 1)}
          >
            Next{">"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
