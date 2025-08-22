import { useEffect, useState } from "react";

import { BallEvent, EventResponse, NoData } from "./Types";
import styles from "./Events.module.css";
import { Link } from "react-router-dom";
import BEASTIE_DATA from "../data/BeastieData";

function EventBlock({ children }: { children: React.ReactNode }) {
  return <div className={styles.eventBlock}>{children}</div>;
}

function TimeDelta({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const usingStartDate = now < startDate.valueOf();
  const focusDate = usingStartDate ? startDate : endDate;

  const totalLength = endDate.valueOf() - startDate.valueOf();
  const done = Math.max(
    Math.min((now - startDate.valueOf()) / totalLength, 1),
    0,
  );

  const future = focusDate.valueOf() > now;
  let delta = Math.abs((focusDate.valueOf() - now) / 1000);
  const days = delta / 86400;
  delta -= Math.floor(days) * 86400;
  const hours = delta / 3600;
  delta -= Math.floor(hours) * 3600;
  const minutes = delta / 60;
  delta -= Math.floor(minutes) * 60;
  const seconds = delta;

  const hoursRounded = Math.round(hours * 10) / 10;
  const dayCount = hoursRounded == 24 ? Math.ceil(days) : Math.floor(days);
  const minCeil = Math.ceil(minutes);
  const hourCount =
    Math.ceil(minutes) == 60 ? Math.ceil(hours) : Math.floor(hours);
  const secCeil = Math.ceil(seconds);
  const minCount = secCeil == 60 ? Math.ceil(minutes) : Math.floor(minutes);
  const secCount = secCeil == 60 ? 0 : secCeil;
  return (
    <>
      <div
        className={styles.eventDoneBar}
        style={{
          width: `calc(${Math.floor(done * 1000) / 10}% + ${10 - Math.floor(1000 * done) / 100}px)`,
        }}
      ></div>
      <div>
        {usingStartDate ? "Starts in " : future ? "Ends in " : "Ended "}
        {days >= 1
          ? `${dayCount} day${dayCount == 1 ? "" : "s"}${hoursRounded != 0 && hoursRounded != 24 ? `, ${hoursRounded} hour${hoursRounded == 1 ? "" : "s"}` : ""}`
          : hours >= 1
            ? `${hourCount} hour${hourCount == 1 ? "" : "s"}${minutes >= 1 && minCeil != 60 ? `, ${minCeil} minute${minCeil == 1 ? "" : "s"}` : ""}`
            : minutes >= 1
              ? `${minCount} minute${minCount == 1 ? "" : "s"}, ${secCount}s`
              : `${secCeil} seconds`}
        {future ? "" : " ago"}
      </div>
    </>
  );
}

const DATETIME_FORMATTER: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  undefined,
  {
    dateStyle: "medium",
    timeStyle: "short",
  },
);

function Bigmoon({ bigmoon }: { bigmoon: BallEvent }) {
  const startDate = new Date(bigmoon.times[0][0]);
  const endDate = new Date(bigmoon.times[0][1]);

  const guilds = bigmoon.guilds.reduce(
    (accum, beastieId) =>
      (accum ? accum + " VS " : accum) + BEASTIE_DATA.get(beastieId)?.name,
    "",
  );
  const bans = bigmoon.bans.reduce(
    (accum, beastieId) =>
      (accum ? accum + ", " : "") + BEASTIE_DATA.get(beastieId)?.name,
    "",
  );

  return (
    <EventBlock>
      <div className={styles.eventImage}>
        <img
          src={`https://dumbandfat.com/beastieball/${bigmoon.img_url}`}
          onLoad={(event) => {
            event.currentTarget.classList.remove(styles.eventImageFailed);
          }}
          onError={(event) => {
            event.currentTarget.classList.add(styles.eventImageFailed);
          }}
        />
      </div>
      <div className={styles.eventBar}>
        <Link
          className={styles.eventTitle}
          to={bigmoon.url}
          target="_blank"
          rel="noopener"
        >
          Bigmoon Bash
          <br />
          <div className={styles.eventSubtitle}>
            {guilds || (bans ? bans + " banned" : undefined) || ""}
          </div>
        </Link>
        <TimeDelta startDate={startDate} endDate={endDate} />
        <div>From: {DATETIME_FORMATTER.format(startDate)}</div>
        <div>Until: {DATETIME_FORMATTER.format(endDate)}</div>
      </div>
    </EventBlock>
  );
}

export default function BigmoonBlock({
  bigmoon,
  bigmoonReload,
}: {
  bigmoon: NoData | EventResponse;
  bigmoonReload: () => void;
}) {
  return bigmoon == NoData.WaitingForResponse ? (
    <EventBlock>Loading...</EventBlock>
  ) : bigmoon == NoData.NoData ? (
    <EventBlock>
      <img className={styles.wahhhhwahhhh} src="/nojs.png" /> No Event{" "}
      <button onClick={bigmoonReload}>Reload</button>
    </EventBlock>
  ) : (
    <Bigmoon bigmoon={bigmoon.currentEvent} />
  );
}
