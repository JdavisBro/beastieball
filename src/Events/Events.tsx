import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { BallEvent, EventResponse, NoEvent } from "./Types";
import styles from "./Events.module.css";
import { Link } from "react-router-dom";
import BEASTIE_DATA from "../data/BeastieData";
import useLocalization from "../localization/useLocalization";

const EVENT_RESPONSE_EXPIRE = 12 * 60 * 60 * 1000;

function updateBigmoon(setBigmoon: (event: NoEvent | BallEvent) => void) {
  fetch("https://api.beastieballgame.com/api/events")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("gameEvent", JSON.stringify(data));
      localStorage.setItem("bigmoonUpdate", String(Date.now()));
      setBigmoon(data.currentEvent);
    })
    .catch(() => setBigmoon(NoEvent.NoEvent));
}

function useBigmoon(open: boolean): [NoEvent | BallEvent, () => void] {
  const [bigmoon, setBigmoon] = useState<NoEvent | BallEvent>(
    NoEvent.WaitingForResponse,
  );

  const forceReload = () => updateBigmoon(setBigmoon);

  useEffect(() => {
    const current = localStorage.getItem("gameEvent");
    if (!current) {
      if (!open) {
        return;
      }
      return updateBigmoon(setBigmoon);
    }
    let currentJson: EventResponse;
    try {
      currentJson = JSON.parse(current);
    } catch {
      if (!open) {
        return;
      }
      return updateBigmoon(setBigmoon);
    }
    setBigmoon(currentJson.currentEvent);
    if (!open) {
      return;
    }
    const now = Date.now();
    const response_expire =
      Number(localStorage.getItem("bigmoonUpdate") ?? 0) +
      EVENT_RESPONSE_EXPIRE;
    if (response_expire < now) {
      updateBigmoon(setBigmoon);
    }
  }, [open]);

  return [bigmoon, forceReload];
}

function EventBlock({ children }: { children: React.ReactNode }) {
  return <div className={styles.eventBlock}>{children}</div>;
}

declare global {
  interface Window {
    forceEventTime?: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
  }
}

function TimeDelta({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const { L } = useLocalization();

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
  if (import.meta.env.DEV && window.forceEventTime) {
    delta =
      window.forceEventTime.days * 86400 +
      window.forceEventTime.hours * 3600 +
      window.forceEventTime.minutes * 60 +
      window.forceEventTime.seconds;
  }

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

  const [oneKey, oneCount, twoKey, twoCount]: [
    string,
    number,
    string | undefined,
    number | undefined,
  ] =
    days >= 1 || (hourCount == 24 && minCeil == 60)
      ? [
          "day",
          dayCount,
          "hour",
          hoursRounded == 24 || hoursRounded == 0 ? undefined : hoursRounded,
        ]
      : hours >= 1
        ? [
            "hour",
            hourCount,
            "minute",
            minCeil == 60 ? 0 : minutes < 1 ? undefined : minCeil,
          ]
        : minutes >= 1
          ? ["minute", minCount, "secondsMini", secCount]
          : [
              "second",
              future ? secCeil : Math.floor(seconds),
              undefined,
              undefined,
            ];

  const text =
    L("events." + oneKey + (oneCount != 1 ? "s" : ""), {
      num: String(oneCount),
    }) +
    (twoKey && twoCount != undefined
      ? `${L("events.timeSep")}${L("events." + twoKey + (twoCount != 1 ? "s" : ""), { num: String(twoCount) })}`
      : "");

  return (
    <>
      <div
        className={styles.eventDoneBar}
        style={{
          width: `calc(${Math.floor(done * 1000) / 10}% + ${10 - Math.floor(1000 * done) / 100}px)`,
        }}
      ></div>
      <div>
        {L(
          usingStartDate
            ? "events.startsIn"
            : future
              ? "events.endsIn"
              : "events.ended",
          { time: text },
        )}
      </div>
    </>
  );
}

function Bigmoon({
  bigmoon,
  bigmoonReload,
}: {
  bigmoon: BallEvent;
  bigmoonReload: () => void;
}) {
  const { L, currentLanguage } = useLocalization();

  const datetime_format: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    navigator.language.startsWith(currentLanguage)
      ? undefined
      : currentLanguage, // use regional format if it's the same lang
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );

  const startDate = new Date(bigmoon.times[0][0]);
  const endDate = new Date(bigmoon.times[0][1]);

  const lastReload = useRef(0);

  const beasties = (
    bigmoon.guilds.length
      ? bigmoon.guilds
      : bigmoon.bans.length
        ? bigmoon.bans
        : undefined
  )
    ?.map((beastieId) => BEASTIE_DATA.get(beastieId)?.name)
    .filter((beastie) => typeof beastie == "string")
    .map((name) => L(name));
  const guildSep = L("events.guildSep");
  const guilds =
    beasties && bigmoon.guilds.length
      ? beasties.reduce(
          (accum, beastie) => (accum ? accum + guildSep : accum) + beastie,
          "",
        ) + L("events.guildSuffix")
      : undefined;
  const bannedSep = L("events.bannedSep");
  const bans =
    beasties && bigmoon.bans.length
      ? beasties.reduce(
          (accum, beastie) => (accum ? accum + bannedSep : "") + beastie,
          "",
        ) + L("events.bannedSuffix")
      : undefined;

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
          {L("events.bigmoon")}
          <br />
          <div className={styles.eventSubtitle}>{guilds ?? bans ?? ""}</div>
        </Link>
        <TimeDelta startDate={startDate} endDate={endDate} />
        <div>
          {L("events.from", { date: datetime_format.format(startDate) })}
        </div>
        <div>
          {L("events.until", { date: datetime_format.format(endDate) })}
        </div>
        <div
          title={L("events.checkForUpdate")}
          className={styles.eventReloadButton}
          onClick={(event) => {
            if (Date.now() < lastReload.current + 10000) {
              return;
            }
            lastReload.current = Date.now();
            bigmoonReload();
            const target = event.currentTarget;
            target.classList.add(styles.reloadButtonSpin);
            setTimeout(() => {
              if (target) {
                target.classList.remove(styles.reloadButtonSpin);
              }
            }, 10000);
          }}
        >
          ⟳
        </div>
      </div>
    </EventBlock>
  );
}

export default function Events() {
  const { L } = useLocalization();

  const [open, setOpen] = useState(false);

  const [bigmoon, bigmoonReload] = useBigmoon(open);
  const now = new Date(Date.now());
  let bigmoonActive = false;
  if (bigmoon != NoEvent.WaitingForResponse && bigmoon != NoEvent.NoEvent) {
    const startDate = new Date(bigmoon.times[0][0]);
    const endDate = new Date(bigmoon.times[0][1]);
    bigmoonActive = now > startDate && now < endDate;
  }

  return (
    <ErrorBoundary fallbackRender={() => null}>
      <div className={styles.events}>
        <div
          className={
            bigmoonActive
              ? open
                ? styles.toggleButtonActiveOpen
                : styles.toggleButtonActive
              : open
                ? styles.toggleButtonOpen
                : styles.toggleButton
          }
          role="button"
          onClick={() => setOpen(!open)}
          tabIndex={0}
        >
          {L("events.title")}
        </div>
        <div className={open ? styles.openBox : styles.closedBox}>
          {open ? (
            bigmoon == NoEvent.WaitingForResponse ? (
              <EventBlock>{L("common.loading")}</EventBlock>
            ) : bigmoon == NoEvent.NoEvent ? (
              <EventBlock>
                <img className={styles.wahhhhwahhhh} src="/nojs.png" />
                {L("events.noEvent")}
                <button onClick={bigmoonReload}>
                  {L("events.checkForUpdate")}
                </button>
              </EventBlock>
            ) : (
              <Bigmoon bigmoon={bigmoon} bigmoonReload={bigmoonReload} />
            )
          ) : undefined}
        </div>
      </div>
    </ErrorBoundary>
  );
}
