import {
  DEFAULT_SEEN,
  FRIEND_SPOILERS,
  SpoilerMode,
  useFriendSpoiler,
  useSpoilerMode,
  useSpoilerSeen,
} from "./useSpoiler";

export default function SpoilerOptions() {
  const [spoilerMode, setSpoilerMode] = useSpoilerMode();
  const [, setSpoilerSeen] = useSpoilerSeen();
  const [, setFriendSpoiler] = useFriendSpoiler();

  return (
    <div>
      <label>
        Show:{" "}
        <select
          value={spoilerMode || SpoilerMode.OnlySeen}
          onChange={(event) => setSpoilerMode(Number(event.target.value))}
        >
          <option value={SpoilerMode.OnlySeen}>Seen Beasties/Characters</option>
          <option value={SpoilerMode.All}>All Beasties/Characters</option>
        </select>
      </label>
      <br />
      {spoilerMode == SpoilerMode.OnlySeen ? (
        <button
          onClick={() => {
            setSpoilerSeen(DEFAULT_SEEN);
            setFriendSpoiler(FRIEND_SPOILERS);
          }}
        >
          Reset Seen Beasties/Characters
        </button>
      ) : null}
    </div>
  );
}
