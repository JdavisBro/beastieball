import { icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

import { SpawnGroup } from "../data/SpawnData";
import { SpoilerMode } from "../shared/useSpoiler";
import BEASTIE_DATA from "../data/BeastieData";
import styles from "./Map.module.css";
import { LocalizationType } from "../localization/useLocalization";

export default function createBeastieBox(
  group: SpawnGroup,
  corner: { x: number; y: number },
  size: { x: number; y: number },
  key: string,
  beastie_filter: string | undefined,
  spoilerMode: SpoilerMode,
  seenBeasties: Record<string, boolean>,
  setSeenBeasties: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
  huntedBeastie: string | undefined,
  Localization: LocalizationType,
) {
  const { L: Loc, getLink } = Localization;
  const overall_percent: {
    [key: string]: {
      percent: number;
      levelMin: number;
      levelMax: number;
      variant: number;
    };
  } = {};
  const non_dupe_beasties: string[] = [];
  group.forEach((value) => {
    if (beastie_filter != "all" && beastie_filter != value.specie) {
      return;
    }
    if (overall_percent[value.specie]) {
      overall_percent[value.specie].percent += value.percent;
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
        percent: value.percent,
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
    const isSpoiler =
      spoilerMode == SpoilerMode.OnlySeen && !seenBeasties[beastie.id];
    const alt = `${isSpoiler ? `Beastie #${beastie.number}` : Loc(beastie.name)} spawn location.`;
    const iconScale = beastie.id != huntedBeastie ? 1 : 1.5;
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
            : `/icons/${Loc(beastie.name, undefined, true)}.png`,
          className: isSpoiler ? styles.spoilerBeastie : undefined,
          iconSize: [50 * iconScale, 50 * iconScale],
        })}
        eventHandlers={{
          click: () => {
            seenBeasties[beastie.id] = true;
            setSeenBeasties(seenBeasties);
          },
        }}
      >
        <Popup offset={[0, -5]}>
          <Link to={getLink(`/beastiepedia/${Loc(beastie.name)}`)}>
            {Loc(beastie.name)}
          </Link>
          <br />
          {overall_percent[value].percent > 0
            ? overall_percent[value].percent
            : "???"}
          %
          <br />
          Level {overall_percent[value].levelMin} -{" "}
          {overall_percent[value].levelMax}
          {beastie.colors2 ? (
            <>
              <br />
              {Loc("map.beastie.variantChance")}
              {overall_percent[value].variant * 100}%
            </>
          ) : null}
        </Popup>
      </Marker>,
    );
  });
  return beastieSpawnsOverlays;
}
