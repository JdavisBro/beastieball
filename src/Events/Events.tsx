import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { BallEvent, EventResponse, NoEvent } from "./Types";
import styles from "./Events.module.css";
import { Link } from "react-router-dom";

function updateBigmoon(setBigmoon: (event: NoEvent | BallEvent) => void) {
  fetch("https://api.beastieballgame.com/api/events")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("gameEvent", JSON.stringify(data));
      setBigmoon(data.currentEvent);
    })
    .catch(() => setBigmoon(NoEvent.NoEvent));
}

function useBigmoon(open: boolean): [NoEvent | BallEvent, () => void] {
  const [bigmoon, setBigmoon] = useState<NoEvent | BallEvent>(
    NoEvent.WaitingForResponse,
  );

  const [reloadTrigger, setReloadTrigger] = useState(false);
  const forceReload = () => setReloadTrigger(!reloadTrigger);

  useEffect(() => {
    if (!open) {
      return;
    }

    const current = localStorage.getItem("gameEvent");
    if (!current) {
      return updateBigmoon(setBigmoon);
    }
    let currentJson: EventResponse;
    try {
      currentJson = JSON.parse(current);
    } catch {
      return updateBigmoon(setBigmoon);
    }
    const endTime = new Date(currentJson.currentEvent.times[0][1]);
    if (endTime < new Date(Date.now())) {
      return updateBigmoon(setBigmoon);
    }
    setBigmoon(currentJson.currentEvent);
  }, [open, reloadTrigger]);

  return [bigmoon, forceReload];
}

function EventBlock({ children }: { children: React.ReactNode }) {
  return <div className={styles.eventBlock}>{children}</div>;
}

function TimeDelta({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timeout = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timeout);
  });

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
  const dayCount = Math.ceil(hours) == 24 ? Math.ceil(days) : Math.floor(days);
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
          width: `${done * 100}%`,
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
  return (
    <EventBlock>
      <div className={styles.eventImage}>
        <img src={`https://dumbandfat.com/beastieball/${bigmoon.img_url}`} />
      </div>
      <div className={styles.eventBar}>
        <Link to={bigmoon.url} target="_blank" rel="noopener">
          Bigmoon Bash
        </Link>
        <TimeDelta startDate={startDate} endDate={endDate} />
        <div>From: {DATETIME_FORMATTER.format(startDate)}</div>
        <div>Until: {DATETIME_FORMATTER.format(endDate)}</div>
      </div>
    </EventBlock>
  );
}

export default function Events() {
  const [open, setOpen] = useState(false);

  const [bigmoon, bigmoonReload] = useBigmoon(open);

  return (
    <ErrorBoundary fallbackRender={() => null}>
      <div className={styles.events}>
        <div
          className={open ? styles.toggleButtonOpen : styles.toggleButton}
          role="button"
          onClick={() => setOpen(!open)}
          tabIndex={0}
        >
          Events
        </div>
        <div className={open ? styles.openBox : styles.closedBox}>
          {bigmoon == NoEvent.WaitingForResponse ? (
            <EventBlock>Loading...</EventBlock>
          ) : bigmoon == NoEvent.NoEvent ? (
            <EventBlock>
              <img className={styles.wahhhhwahhhh} src="/nojs.png" /> No Event{" "}
              <button onClick={bigmoonReload}>Reload</button>
            </EventBlock>
          ) : (
            <Bigmoon bigmoon={bigmoon} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
