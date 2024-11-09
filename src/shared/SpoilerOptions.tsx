import {
  DEFAULT_SEEN,
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "./useSpoiler";

export default function SpoilerOptions() {
  const [spoilerMode, setSpoilerMode] = useSpoilerMode();
  const [, setSpoilerSeen] = useSpoilerSeen();

  return (
    <div>
      <label>
        Show:{" "}
        <select
          value={spoilerMode || SpoilerMode.OnlySeen}
          onChange={(event) => setSpoilerMode(Number(event.target.value))}
        >
          <option value={SpoilerMode.OnlySeen}>Seen Beasties</option>
          <option value={SpoilerMode.All}>All Beasties</option>
        </select>
      </label>
      <br />
      {spoilerMode == SpoilerMode.OnlySeen ? (
        <button onClick={() => setSpoilerSeen(DEFAULT_SEEN)}>
          Reset Seen Beasties
        </button>
      ) : null}
    </div>
  );
}
