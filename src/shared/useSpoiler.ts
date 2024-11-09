import { useLocalStorage } from "usehooks-ts";

export enum SpoilerMode {
  OnlySeen,
  All,
}

export const DEFAULT_SEEN = {
  shroom1: true,
  bilby1: true,
  frog1: true,
  cassowary1: true,
};

export function useSpoilerMode() {
  return useLocalStorage<SpoilerMode>(
    "spoilerMode",
    window.navigator.userAgent.toLowerCase().includes("prerender")
      ? SpoilerMode.All
      : SpoilerMode.OnlySeen,
  );
}

export function useSpoilerSeen() {
  return useLocalStorage<Record<string, boolean>>("spoilerSeen", DEFAULT_SEEN);
}
