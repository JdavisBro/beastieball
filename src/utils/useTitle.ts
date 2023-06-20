import { useEffect } from "react";

export default function useTitle(
  text: string,
  path: string | null | undefined = null
) {
  useEffect(() => {
    document.title = text;

    if (path !== null) {
      window.history.replaceState(null, text, path);
    }
  }, [text, path]);
}
