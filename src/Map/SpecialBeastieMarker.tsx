import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

import { BeastieType } from "../data/BeastieData";
import {
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "../shared/useSpoiler";
import styles from "./Map.module.css";
import useLocalization from "../localization/useLocalization";

export default function SpecialBeastieMarker({
  position,
  target,
  open,
  metamorph,
}: {
  position: L.LatLng;
  target: BeastieType;
  open?: boolean;
  metamorph?: { from: BeastieType; by: string };
}) {
  const { L: Loc, getLink } = useLocalization();

  const [spoilerMode] = useSpoilerMode();
  const [beastiesSeen, setBeastiesSeen] = useSpoilerSeen();

  const isSpoiler =
    spoilerMode == SpoilerMode.OnlySeen && !beastiesSeen[target.id];

  const setSeen = (beastieId: string) => {
    setBeastiesSeen({ ...beastiesSeen, [beastieId]: true });
  };

  const targetNameStr = Loc(target.name);
  const targetUrl = isSpoiler
    ? "/gameassets/sprExclam_1.png"
    : `/icons/${Loc(target.name, undefined, true)}.png`;
  const handleTargetClick = isSpoiler ? () => setSeen(target.id) : undefined;
  const targetImage = (
    <Link
      to={isSpoiler ? "#" : getLink(`/beastiepedia/${targetNameStr}`)}
      onClick={handleTargetClick}
    >
      <img src={targetUrl} onClick={handleTargetClick} />
    </Link>
  );
  const targetName = (
    <Link
      to={isSpoiler ? "#" : getLink(`/beastiepedia/${targetNameStr}`)}
      onClick={handleTargetClick}
    >
      {isSpoiler ? Loc("common.spoiler") : targetNameStr}
    </Link>
  );

  const metamorphSpoiler = metamorph
    ? spoilerMode == SpoilerMode.OnlySeen && !beastiesSeen[metamorph.from.id]
    : true;
  const handleMetamorphClick =
    metamorph && metamorphSpoiler
      ? () => setSeen(metamorph.from.id)
      : undefined;

  const metamorphFromName = metamorph ? Loc(metamorph.from.name) : undefined;

  return (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: targetUrl,
        iconSize: [55, 55],
      })}
      eventHandlers={
        open
          ? {
              add: (event) => {
                event.target.openPopup();
              },
            }
          : undefined
      }
    >
      <Popup offset={[0, -15]}>
        {metamorph ? (
          <>
            <div className={styles.metamorph}>
              <div className={styles.metamorphColumn}>
                <Link
                  to={
                    metamorphSpoiler
                      ? "#"
                      : getLink(`/beastiepedia/${metamorphFromName}`)
                  }
                  onClick={handleMetamorphClick}
                >
                  <img
                    src={
                      metamorphSpoiler
                        ? "/gameassets/sprExclam_1.png"
                        : `/icons/${Loc(metamorph.from.name, undefined, true)}.png`
                    }
                  />
                </Link>
                <Link
                  to={
                    metamorphSpoiler
                      ? "#"
                      : getLink(`/beastiepedia/${metamorphFromName}`)
                  }
                  onClick={handleMetamorphClick}
                >
                  {metamorphSpoiler ? Loc("common.spoiler") : metamorphFromName}
                </Link>
              </div>
              <div>{Loc("map.metamorphosis.arrow")}</div>
              <div className={styles.metamorphColumn}>
                {targetImage}
                {targetName}
              </div>
            </div>
            {Loc("map.metamorphosis." + metamorph.by)}
          </>
        ) : (
          <div className={styles.specialBeastie}>
            {targetImage}
            <div>
              {Loc("map.extinctFoundHerePre")}
              {targetName}
              {Loc("map.extinctFoundHerePost")}
            </div>
          </div>
        )}
      </Popup>
    </Marker>
  );
}
