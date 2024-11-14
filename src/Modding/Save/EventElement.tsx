// import { MOVE_DIC } from "../../data/MoveData";
// import WORLD_DATA from "../../data/WorldData";
import TextTag from "../../shared/TextTag";
import parseDate from "../../utils/gmdate";
import styles from "./Beastie.module.css";
import { VIBES } from "./BeastieValues";
import { BeastieLogEvent } from "./SaveType";

enum EventType {
  RECRUIT = 0,
  RANKED_WINNING_POINT = 3, // appears on winning point beastie
  RANKED_NOT_WINNING_POINT = 4, // appears on all beasties except winning point
  RANKED_BATTLE_WON = 5, // appears on all beasties in a ranked match
  NEW_RELATIONSHIP = 6,
  LEARNED_FRIEND_MOVE = 7,
}

const RANKED_TEAMS: { [key: string]: string } = {
  redd: "The Rutile All-stars",
};

const FRIEND_TYPE: { [key: number]: string } = {
  1: "Sweetheart",
  2: "Bestie",
  3: "Rival",
  4: "Partner",
};

function EventText({ event }: Props): React.ReactElement | null {
  switch (event.event) {
    case EventType.RECRUIT: {
      const level = "somewhere";
      // WORLD_DATA.level_stumps_array.find(
      //   (value) => value.name == event.args[1],
      // )?.display_name ?? "somewhere";
      return (
        <>
          Recruited by {event.args[0]} from {level}. Their vibe was{" "}
          {VIBES[event.args[2] as number] ?? event.args[2]}.
        </>
      );
    }

    case EventType.RANKED_WINNING_POINT: {
      return (
        <TextTag>
          Scored the game-winning point against [shadow][c_yellow]
          {RANKED_TEAMS[event.args[0] as string]}[/c][/shadow]!
        </TextTag>
      );
    }

    case EventType.RANKED_NOT_WINNING_POINT: {
      return (
        <TextTag>
          Did not score the game-winning point against [shadow][c_yellow]
          {RANKED_TEAMS[event.args[0] as string]}[/c][/shadow].
        </TextTag>
      );
    }

    case EventType.RANKED_BATTLE_WON: {
      return (
        <TextTag>
          Won a Ranked Match against [shadow][c_yellow]
          {RANKED_TEAMS[event.args[0] as string]}[/c][/shadow] with the help of
          their team!
        </TextTag>
      );
    }

    case EventType.NEW_RELATIONSHIP: {
      return (
        <TextTag>
          {event.args[0] as string} became their{" "}
          {FRIEND_TYPE[event.args[1] as number]}!
        </TextTag>
      );
    }

    case EventType.LEARNED_FRIEND_MOVE: {
      return (
        <TextTag>
          Learned how to PLAY from {event.args[1]}, their{" "}
          {FRIEND_TYPE[event.args[2] as number]}.
        </TextTag>
      );
    }
  }
  return (
    <>
      Unknown Type: {event.event}
      <br />
      Args: "{event.args.join('", "')}"
    </>
  );
}

type Props = {
  event: BeastieLogEvent;
};

export default function EventElement({ event }: Props): React.ReactElement {
  const date = parseDate(event.date);

  return (
    <div className={styles.event}>
      <div>
        <span title={date.toString()}>{date.toLocaleDateString()}</span>
        {" ~ "}
        <span>Level {event.level}</span>
      </div>
      <div>
        <EventText event={event} />
      </div>
    </div>
  );
}
