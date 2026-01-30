import { useEffect, useState } from "react";

import { BallEvent, EventResponse, NoData } from "./Types";
import styles from "./Events.module.css";
import { Link } from "react-router-dom";
import BEASTIE_DATA from "../data/BeastieData";
import useLocalization from "../localization/useLocalization";

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

function Bigmoon({ bigmoon }: { bigmoon: BallEvent }) {
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

  const random_teams = bigmoon.rules.mode == 1;

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
          {random_teams ? L("events.random") : L("events.bigmoon")}
          <br />
          <div className={styles.eventSubtitle}>{guilds ?? bans ?? null}</div>
        </Link>
        <TimeDelta startDate={startDate} endDate={endDate} />
        <div>
          {L("events.from", { date: datetime_format.format(startDate) })}
        </div>
        <div>
          {L("events.until", { date: datetime_format.format(endDate) })}
        </div>
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
  const { L } = useLocalization();

  return bigmoon == NoData.WaitingForResponse ? (
    <EventBlock>{L("common.loading")}</EventBlock>
  ) : bigmoon == NoData.NoData ? (
    <EventBlock>
      <img className={styles.wahhhhwahhhh} src="/nojs.png" />
      {L("events.noEvent")}
      <button onClick={bigmoonReload}>{L("events.checkForUpdate")}</button>
    </EventBlock>
  ) : (
    <Bigmoon bigmoon={bigmoon.currentEvent} />
  );
}
