import WORLD_DATA from "../../data/WorldData";
import TextTag from "../../shared/TextTag";
import parseDate from "../../utils/gmdate";
import { BeastieLogEvent } from "./SaveType";

const FRIEND_TYPE: { [key: number]: string } = {
  4: "Partner",
};

function BaseEvent(props: {
  children: React.ReactNode;
  date: Date;
  level: number;
}): React.ReactElement {
  return (
    <div>
      <div>
        <span title={props.date.toString()}>
          {props.date.toLocaleDateString()}
        </span>
        {" ~ "}
        <span>Level {props.level}</span>
      </div>
      <div>{props.children}</div>
    </div>
  );
}
type Props = {
  event: BeastieLogEvent;
};

enum EventType {
  RECRUIT = 0,

  NEW_RELATIONSHIP = 6,
}

export default function EventElement({
  event,
}: Props): React.ReactElement | null {
  const date = parseDate(event.date);

  switch (event.event) {
    case EventType.RECRUIT: {
      const level =
        WORLD_DATA.level_stumps_array.find(
          (value) => value.name == event.args[1],
        )?.display_name ?? "somewhere";
      return (
        <BaseEvent date={date} level={event.level}>
          Recruited by {event.args[0]} from {level}. Their vibe was{" "}
          {event.args[2]}.
        </BaseEvent>
      );
    }

    case EventType.NEW_RELATIONSHIP: {
      return (
        <BaseEvent date={date} level={event.level}>
          <TextTag>{event.args[0] as string}</TextTag> became their{" "}
          {FRIEND_TYPE[event.args[1] as number]}!
        </BaseEvent>
      );
    }
  }
  console.log(`!! Unknown Event Type: ${event.event} !!`);
  return (
    <BaseEvent date={date} level={event.level}>
      {" "}
    </BaseEvent>
  );
}
