import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import InfoBox from "./InfoBox";
import { useLocation, useNavigate } from "react-router-dom";

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
    hashValue: string;
    onClose: () => void;
  },
) {
  const location = useLocation();

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
      dialog.addEventListener("keydown", preventScrollKeys, {
        passive: false,
      });
      return () => {
        dialog.removeEventListener("wheel", preventDefault);
        dialog.removeEventListener("keydown", preventScrollKeys);
      };
    }
  }, [preventDefault, preventScrollKeys]);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.open) {
      navigate("#" + props.hashValue);
    }
  }, [props.open, props.hashValue, navigate]);

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }
    if (
      props.open &&
      !dialogRef.current.open &&
      window.location.hash == "#" + props.hashValue
    ) {
      dialogRef.current.showModal();
    } else if (!props.open && dialogRef.current.open) {
      dialogRef.current.close();
    } else if (props.open && window.location.hash != "#" + props.hashValue) {
      if (dialogRef.current.open) {
        dialogRef.current.close();
      } else {
        props.onClose();
      }
    }
  }, [props, navigate, location]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target == dialogRef.current) {
          dialogRef.current.close();
        }
      }}
      onClose={() => {
        props.onClose();
        if (window.location.hash == "#" + props.hashValue) {
          navigate(-1);
        }
      }}
    >
      <InfoBox key="MODALinfobox" header={props.header}>
        {props.open ? props.children : null}
      </InfoBox>
    </dialog>
  );
}
