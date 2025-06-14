/// <reference types="react/canary" />

import { useEffect, useRef } from "react";

import styles from "./ContentPreview.module.css";

export default function ImageContextMenu({
  children,
  downloadImage,
  downloadGif,
  gifDisabled,
  className,
  style,
}: {
  children: React.ReactNode;
  downloadImage: (copy?: boolean) => void;
  downloadGif: () => void;
  gifDisabled: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callback = () => {
      if (popoverRef.current) {
        popoverRef.current.hidePopover();
      }
    };
    const keyboardCallback = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        callback();
      }
    };
    document.addEventListener("click", callback);
    document.addEventListener("touchmove", callback);
    document.addEventListener("scroll", callback, true);
    document.addEventListener("keydown", keyboardCallback, true);
    return () => {
      document.removeEventListener("click", callback);
      document.removeEventListener("touchmove", callback);
      document.removeEventListener("scroll", callback, true);
      document.removeEventListener("keydown", keyboardCallback, true);
    };
  }, []);

  return (
    <>
      <div
        popover="manual"
        onContextMenu={(event) => event.preventDefault()}
        className={styles.contextMenu}
        ref={popoverRef}
      >
        <div>
          <button
            className={styles.contextButton}
            onClick={() => downloadImage(true)}
          >
            Copy PNG
          </button>
          <button
            className={styles.contextButton}
            onClick={() => downloadImage()}
          >
            Save PNG
          </button>
          <button
            className={styles.contextButton}
            onClick={() => downloadGif()}
            disabled={gifDisabled}
          >
            Save GIF
          </button>
        </div>
      </div>
      <div
        onContextMenu={(event) => {
          event.preventDefault();
          if (popoverRef.current) {
            popoverRef.current.showPopover();
            popoverRef.current.style.setProperty(
              "--menu-x",
              `${event.clientX + 4}px`,
            );
            popoverRef.current.style.setProperty(
              "--menu-y",
              `${event.clientY + 4}px`,
            );
          }
        }}
        className={className}
        style={style}
      >
        {children}
      </div>
    </>
  );
}
