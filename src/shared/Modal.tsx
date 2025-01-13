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
  const location = useLocation();

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }
    const dialogOpen = dialogRef.current.open;
    const hashCorrect = window.location.hash == "#" + props.hashValue;
    if (props.open) {
      if (!dialogOpen) {
        dialogRef.current.showModal();
        if (hashCorrect) {
          const old = new URL(window.location.href);
          old.hash = "";
          history.replaceState({}, "", old.toString());
        }
        navigate({
          search: window.location.search,
          hash: "#" + props.hashValue,
        });
      }
      if (dialogOpen && !hashCorrect) {
        dialogRef.current.close();
      }
    } else if (dialogOpen) {
      dialogRef.current.close();
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
        if (window.location.hash == "#" + props.hashValue) {
          navigate(-1);
        }
        props.onClose();
      }}
    >
      <InfoBox key="MODALinfobox" header={props.header}>
        {props.open ? props.children : null}
      </InfoBox>
    </dialog>
  );
}
