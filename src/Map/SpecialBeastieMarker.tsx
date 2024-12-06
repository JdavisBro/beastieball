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

export default function SpecialBeastieMarker({
  position,
  target,
  metamorph,
}: {
  position: L.LatLng;
  target: BeastieType;
  metamorph?: { from: BeastieType; by: string };
}) {
  const [spoilerMode] = useSpoilerMode();
  const [beastiesSeen, setBeastiesSeen] = useSpoilerSeen();

  const isSpoiler =
    spoilerMode == SpoilerMode.OnlySeen && !beastiesSeen[target.id];

  const setSeen = (beastieId: string) => {
    setBeastiesSeen({ ...beastiesSeen, [beastieId]: true });
  };

  const targetUrl = isSpoiler
    ? "/gameassets/sprExclam_1.png"
    : `/icons/${target.name}.png`;
  const handleTargetClick = isSpoiler ? () => setSeen(target.id) : undefined;
  const targetImage = (
    <Link
      to={isSpoiler ? "#" : `/beastiepedia/${target.name}`}
      onClick={handleTargetClick}
    >
      <img src={targetUrl} onClick={handleTargetClick} />
    </Link>
  );
  const targetName = (
    <Link
      to={isSpoiler ? "#" : `/beastiepedia/${target.name}`}
      onClick={handleTargetClick}
    >
      {isSpoiler ? "???" : target.name}
    </Link>
  );

  const metamorphSpoiler = metamorph
    ? spoilerMode == SpoilerMode.OnlySeen && !beastiesSeen[metamorph.from.id]
    : true;
  const handleMetamorphClick =
    metamorph && metamorphSpoiler
      ? () => setSeen(metamorph.from.id)
      : undefined;

  return (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: targetUrl,
        iconSize: [55, 55],
      })}
    >
      <Popup>
        {metamorph ? (
          <>
            <div className={styles.metamorph}>
              <div className={styles.metamorphColumn}>
                <Link
                  to={
                    metamorphSpoiler
                      ? "#"
                      : `/beastiepedia/${metamorph.from.name}`
                  }
                  onClick={handleMetamorphClick}
                >
                  <img
                    src={
                      metamorphSpoiler
                        ? "/gameassets/sprExclam_1.png"
                        : `/icons/${metamorph.from.name}.png`
                    }
                  />
                </Link>
                <Link
                  to={
                    metamorphSpoiler
                      ? "#"
                      : `/beastiepedia/${metamorph.from.name}`
                  }
                  onClick={handleMetamorphClick}
                >
                  {metamorphSpoiler ? "???" : metamorph.from.name}
                </Link>
              </div>
              <div>→</div>
              <div className={styles.metamorphColumn}>
                {targetImage}
                {targetName}
              </div>
            </div>
            {metamorph.by}
          </>
        ) : (
          <div className={styles.specialBeastie}>
            {targetImage}
            <div>{targetName} is found here initially.</div>
          </div>
        )}
      </Popup>
    </Marker>
  );
}
