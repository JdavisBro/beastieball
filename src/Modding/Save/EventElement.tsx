// import { MOVE_DIC } from "../../data/MoveData";
// import WORLD_DATA from "../../data/WorldData";
import TextTag from "../../shared/TextTag";
import parseDate from "../../utils/gmdate";
import styles from "./Beastie.module.css";
import { BeastieLogEvent } from "./SaveType";

import VIBES from "../../data/raw/vibes.json";
import BEASTIE_DATA from "../../data/BeastieData";
import MOVE_DIC from "../../data/MoveData";

enum EventType {
  RECRUIT = 0,
  METAMORPH = 2,
  RANKED_WINNING_POINT = 3, // appears on winning point beastie
  RANKED_NOT_WINNING_POINT = 4, // appears on all beasties except winning point
  RANKED_BATTLE_WON = 5, // appears on all beasties in a ranked match
  NEW_RELATIONSHIP = 6,
  LEARNED_FRIEND_MOVE = 7,

  U10 = 10,

  METAMORPH_MUSHROOM_0 = 19,
  METAMORPH_MUSHROOM_1 = 20,
  METAMORPH_MUSHROOM_2 = 21,
}

const RANKED_TEAMS: { [key: string]: string } = {
  redd: "The Rutile All-stars",
  mask: "The Mega Beasts",
  riven: "The Mythic Dreamers",
  kaz: "The Raging Blazes",
  science: "The Wild Flowers",
  celeb: "The Golden Gods",
  streamer: "The Hello Freaks",
  pirate: "The Party Pirates",
  warrior: "The Silent Warriors",
  academy: "The Magic Moons",
  redd2: "The Rutile All-stars",
  racer: "The Crimson Racers",
  cycle: "The Midnight Machines",
  champion: "The Radical Queens",
};

const FRIEND_TYPE: { [key: number]: string } = {
  1: "Sweetheart",
  2: "Bestie",
  3: "Rival",
  4: "Partner",
};

function eventText(event: BeastieLogEvent): React.ReactNode {
  switch (event.event) {
    case EventType.RECRUIT: {
      const level = event.args[1];
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

    case EventType.METAMORPH: {
      return (
        <>
          Metamorphed into a new species:{" "}
          {BEASTIE_DATA.get(event.args[0] as string)?.name ?? event.args[0]}!
          Their vibe became {VIBES[event.args[1] as number] ?? event.args[1]}.
        </>
      );
    }

    case EventType.RANKED_WINNING_POINT: {
      return (
        <TextTag>
          Scored the game-winning point against [shadow][c_yellow]
          {RANKED_TEAMS[event.args[0] as string]}[/c][/shadow] with the help of
          their team!
        </TextTag>
      );
    }

    case EventType.RANKED_NOT_WINNING_POINT: {
      // only when not the game winning point?
      return null;
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
          Learned how to {MOVE_DIC[event.args[0]].name} from {event.args[1]},
          their {FRIEND_TYPE[event.args[2] as number]}.
        </TextTag>
      );
    }

    case EventType.U10:
      return null;

    case EventType.METAMORPH_MUSHROOM_0:
    case EventType.METAMORPH_MUSHROOM_1:
    case EventType.METAMORPH_MUSHROOM_2: {
      return <>Communed with a mushroom colony in {event.args[0]}.</>;
    }
  }
  return (
    <>
      Unknown Type: {event.event} - Args: "{event.args.join('", "')}"
    </>
  );
}

export default function EventElement({
  event,
}: {
  event: BeastieLogEvent;
}): React.ReactNode {
  const date = parseDate(event.date);

  const text = eventText(event);
  if (!text) {
    return null;
  }

  return (
    <div className={styles.event}>
      <div>
        <span title={date.toString()}>{date.toLocaleDateString()}</span>
        {" ~ "}
        <span>Level {event.level}</span>
      </div>
      <div>
        {">"} {text}
      </div>
    </div>
  );
}
