import { icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

import { SpawnGroup } from "../data/SpawnData";
import BEASTIE_DATA from "../data/BeastieData";
import styles from "./Map.module.css";

export default function createBeastieBox(
  group: SpawnGroup,
  corner: { x: number; y: number },
  size: { x: number; y: number },
  key: string,
  beastie_filter: string | undefined,
  isSpoilerFn: (subject: string) => boolean,
  setSeen: (subject: string) => void,
  huntedBeastie: string | undefined,
  attractSpray: boolean,
) {
  const overall_percent: {
    [key: string]: {
      percent: number;
      levelMin: number;
      levelMax: number;
      variant: number;
    };
  } = {};
  const non_dupe_beasties: string[] = [];
  let previous_freq = 0;
  group.forEach((value, index) => {
    const freq = attractSpray
      ? value.freq + ((100 * (index + 1)) / group.length - value.freq) * 0.5
      : value.freq;
    const percent = freq - previous_freq;
    previous_freq = freq;
    if (beastie_filter != "all" && beastie_filter != value.specie) {
      return;
    }
    if (overall_percent[value.specie]) {
      overall_percent[value.specie].percent += percent;
      overall_percent[value.specie].levelMin = Math.min(
        overall_percent[value.specie].levelMin,
        value.lvlA,
      );
      overall_percent[value.specie].levelMax = Math.min(
        overall_percent[value.specie].levelMax,
        value.lvlB,
      );
    } else {
      non_dupe_beasties.push(value.specie);
      overall_percent[value.specie] = {
        percent: percent,
        levelMin: value.lvlA,
        levelMax: value.lvlB,
        variant: value.variant,
      };
    }
  });
  const beastieSpawnsOverlays: React.ReactElement[] = [];
  non_dupe_beasties.forEach((value, index) => {
    const beastie = BEASTIE_DATA.get(value);
    if (!beastie) {
      return;
    }
    const isSpoiler = isSpoilerFn(beastie.id);
    const alt = `${isSpoiler ? `Beastie #${beastie.number}` : beastie.name} spawn location.`;
    const iconScale = beastie.id != huntedBeastie ? 1 : 1.5;
    const overall = overall_percent[value];
    beastieSpawnsOverlays.push(
      <Marker
        key={`${key}-${beastie.id}`}
        alt={alt}
        title={alt}
        position={
          Math.max(size.x, size.y) / Math.min(size.x, size.y) < 1.5
            ? // square enough, diag
              [
                -(
                  corner.y +
                  (index + 0.5) * (size.y / non_dupe_beasties.length)
                ),
                corner.x + (index + 0.5) * (size.x / non_dupe_beasties.length),
              ]
            : size.x > size.y
              ? [
                  -(corner.y + size.y / 2),
                  corner.x +
                    (index + 0.5) * (size.x / non_dupe_beasties.length),
                ]
              : [
                  -(
                    corner.y +
                    (index + 0.5) * (size.y / non_dupe_beasties.length)
                  ),
                  corner.x + size.x / 2,
                ]
        }
        icon={icon({
          iconUrl: isSpoiler
            ? "/gameassets/sprExclam_1.png"
            : `/icons/${beastie.name}.png`,
          className: isSpoiler ? styles.spoilerBeastie : undefined,
          iconSize: [50 * iconScale, 50 * iconScale],
        })}
        eventHandlers={{
          click: () => setSeen(beastie.id),
        }}
      >
        <Popup offset={[0, -5]}>
          <Link to={`/beastiepedia/${beastie.name}`}>{beastie.name}</Link>
          <br />
          <span title={`${overall.percent}%`}>
            {overall.percent > 0
              ? Math.round(overall.percent * 100) / 100
              : "???"}
            %
          </span>
          <br />
          Level{" "}
          {attractSpray
            ? overall.levelMax + 1
            : overall.levelMin == overall.levelMax
              ? overall.levelMax
              : `${overall.levelMin} - ${overall.levelMax}`}
          {beastie.colors2 ? (
            <>
              <br />
              Variant Chance: {overall.variant * 100}%
            </>
          ) : null}
        </Popup>
      </Marker>,
    );
  });
  return beastieSpawnsOverlays;
}
