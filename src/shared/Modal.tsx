import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import InfoBox from "./InfoBox";

const SCROLL_KEYS = [
  "ArrowLeft",
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  " ",
  "PageUp",
  "PageDown",
  "Home",
  "End",
];

export default function Modal(
  props: PropsWithChildren & {
    header: string;
    open: boolean;
    onClose: () => void;
  },
) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const preventDefault = useCallback((event: Event) => {
    let elem: HTMLElement | null = event.target as HTMLElement;
    while (elem && elem != dialogRef.current) {
      if (elem.scrollHeight > elem.clientHeight) {
        return;
      }
      elem = elem.parentElement;
    }
    event.stopPropagation();
    event.preventDefault();
  }, []);

  const preventScrollKeys = useCallback(
    (event: KeyboardEvent) => {
      if (SCROLL_KEYS.includes(event.key)) {
        preventDefault(event);
      }
    },
    [preventDefault],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.addEventListener("wheel", preventDefault, {
        passive: false,
      });
      dialog.addEventListener("touchmove", preventDefault, {
        passive: false,
      });
      dialog.addEventListener("keydown", preventScrollKeys, {
        passive: false,
      });
      return () => {
        dialog.removeEventListener("wheel", preventDefault);
        dialog.removeEventListener("touchmove", preventDefault);
        dialog.removeEventListener("keydown", preventScrollKeys);
      };
    }
  }, [preventDefault, preventScrollKeys]);

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }
    if (props.open && !dialogRef.current.open) {
      dialogRef.current.showModal();
    } else if (!props.open && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [props.open]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target == dialogRef.current) {
          props.onClose();
        }
      }}
    >
      <InfoBox key="MODALinfobox" header={props.header}>
        {props.children}
      </InfoBox>
    </dialog>
  );
}
