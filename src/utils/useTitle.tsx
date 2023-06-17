import { useEffect } from "react";

export default function useTitle(
    text: string,
    path: string | null | undefined = null,
) {
    useEffect(() => {
        // eslint-disable-next-line no-undef
        document.title = text;

        if (path !== null) {
            // eslint-disable-next-line no-undef
            window.history.replaceState(null, text, path);
        }
    }, [text, path]);
}