import useLocalization from "../localization/useLocalization";
import {
  DEFAULT_SEEN,
  FRIEND_SPOILERS,
  SpoilerMode,
  useFriendSpoiler,
  useSpoilerMode,
  useSpoilerSeen,
} from "./useSpoiler";

export default function SpoilerOptions() {
  const { L } = useLocalization();

  const [spoilerMode, setSpoilerMode] = useSpoilerMode();
  const [, setSpoilerSeen] = useSpoilerSeen();
  const [, setFriendSpoiler] = useFriendSpoiler();

  return (
    <div>
      <label>
        {L("common.spoilerOptions.showLabel")}
        <select
          value={spoilerMode || SpoilerMode.OnlySeen}
          onChange={(event) =>
            setSpoilerMode(Number(event.currentTarget.value))
          }
        >
          <option value={SpoilerMode.OnlySeen}>
            {L("common.spoilerOptions.seen")}
          </option>
          <option value={SpoilerMode.All}>
            {L("common.spoilerOptions.all")}
          </option>
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
          {L("common.spoilerOptions.reset")}
        </button>
      ) : null}
    </div>
  );
}
