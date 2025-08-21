import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { EventResponse, NoData } from "./Types";
import styles from "./Events.module.css";
import { useGameData } from "./useGameData";
import BigmoonBlock from "./Bigmoon";
import Carousel from "./Carousel";

export default function Events() {
  const [open, setOpen] = useState(false);

  const [bigmoonData, bigmoonReload] = useGameData<EventResponse>(
    "events",
    "gameEvent",
    open,
  );
  const hasBigmoonData =
    bigmoonData != NoData.WaitingForResponse && bigmoonData != NoData.NoData;
  const bigmoon = hasBigmoonData ? bigmoonData.currentEvent : undefined;

  const now = new Date(Date.now());
  let bigmoonActive = false;
  if (bigmoon) {
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
          Events/News
        </div>
        <div className={open ? styles.openBox : styles.closedBox}>
          {open ? (
            <Carousel bigmoonReload={bigmoonReload}>
              <BigmoonBlock
                bigmoon={bigmoonData}
                bigmoonReload={bigmoonReload}
              />
            </Carousel>
          ) : null}
        </div>
      </div>
    </ErrorBoundary>
  );
}
