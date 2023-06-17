// @flow strict

import { useEffect } from "react";

export default function setTitle(text: string, path: ?string = null) {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    document.title = text;
    if (path !== null) {
      // eslint-disable-next-line no-undef
      window.history.replaceState(null, text, path);
    }
  }, [text, path]);
}
