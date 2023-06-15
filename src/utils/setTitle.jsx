// @flow strict

import { useEffect } from "react";

export default function setTitle(text: string) {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    document.title = text;
  }, [text]);
}
