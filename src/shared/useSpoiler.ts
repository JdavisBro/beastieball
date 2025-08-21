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

export const FRIEND_SPOILERS = {
  riley: true,
};

export function useFriendSpoiler() {
  return useLocalStorage<Record<string, boolean>>(
    "spoilerFriends",
    FRIEND_SPOILERS,
  );
}

export function useIsSpoiler(
  friend?: boolean,
): [(subject: string) => boolean, (subject: string | string[]) => void] {
  let spoilerSeen: Record<string, boolean>;
  let setSpoilerSeen: ReturnType<typeof useSpoilerSeen>[1];
  if (friend) {
    [spoilerSeen, setSpoilerSeen] = useFriendSpoiler();
  } else {
    [spoilerSeen, setSpoilerSeen] = useSpoilerSeen();
  }
  const [spoilerMode] = useSpoilerMode();

  return [
    spoilerMode == SpoilerMode.All
      ? () => false
      : (subject: string) => {
          return !spoilerSeen[subject];
        },
    (subject: string | string[]) => {
      setSpoilerSeen((oldSeen) => {
        if (Array.isArray(subject)) {
          for (const sub of subject) {
            oldSeen[sub] = true;
          }
        } else {
          oldSeen[subject] = true;
        }
        return oldSeen;
      });
    },
  ];
}

export function useIsSpoilerFriend() {
  return useIsSpoiler(true);
}
