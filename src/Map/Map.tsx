import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import {
  ImageOverlay,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import WORLD_DATA, { EXTRA_MARKERS } from "../data/WorldData";
import styles from "./Map.module.css";
import OpenGraph from "../shared/OpenGraph";
import { createMarkers } from "./createMarkers";
import Header from "../shared/Header";
import SPAWN_DATA from "../data/SpawnData";
import BEASTIE_DATA from "../data/BeastieData";
import ITEM_DIC from "../data/ItemData";
import TextTag from "../shared/TextTag";
import {
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "../shared/useSpoiler";
import OTHER_AREAS from "./OtherLayerAreas";

function MapEvents() {
  useMapEvents({
    popupopen: (event) =>
      event.popup.getElement()?.classList.remove("leaflet-popup-closing"),
    popupclose: (event) =>
      event.popup.getElement()?.classList.add("leaflet-popup-closing"),
  });

  return null;
}

export default function Map(): React.ReactNode {
  // these are estimates based on comparing the map to a screenshot but they should be about right for now
  const bounds = new L.LatLngBounds([0, 0], [1, 1]);
  const map_bg_bounds = new L.LatLngBounds([83000, -160000], [-42333, 14762]);
  const level_overlays: React.ReactElement[] = [];

  // BG images
  level_overlays.push(
    <ImageOverlay
      className={styles.mapBg}
      key="background"
      url={"/gameassets/maps/sprMap_BG_0.png"}
      bounds={map_bg_bounds}
    />,
    <ImageOverlay
      className={styles.mapBg}
      key="backgroundXtra"
      url={"/gameassets/maps/sprMap_BG_xtra_0.png"}
      bounds={map_bg_bounds}
    />,
  );

  const beastieSpawnsOverlays: React.ReactElement[] = [];

  const [spoilerMode] = useSpoilerMode();
  const [seenBeasties, setSeenBeasties] = useSpoilerSeen();

  const [beastiesLevel, setBeastiesLevel] = useState("");

  WORLD_DATA.level_stumps_array.forEach((level) => {
    const level_size = {
      x: level.world_x2 - level.world_x1,
      y: level.world_y2 - level.world_y1,
    };
    let x = level.world_x1;
    let y = level.world_y1;

    const layer = level.world_layer ? level.world_layer : 0;
    let area_found = false;
    if (layer != 0) {
      for (const area of OTHER_AREAS) {
        if (!level.name.startsWith(area.prefix)) {
          continue;
        }
        x = x + area.offset[0];
        y = y + area.offset[1];
        area_found = true;
        break;
      }
      if (!area_found) {
        return;
      }
    }
    const level_bounds = new L.LatLngBounds(
      [-y, x],
      [-(y + level_size.y), x + level_size.x],
    );
    bounds.extend(level_bounds);

    const show_beasties = beastiesLevel == level.name;

    level_overlays.push(
      <ImageOverlay
        className={
          level.name == "ocean"
            ? show_beasties
              ? styles.bigLevelSelected
              : styles.bigLevel
            : show_beasties
              ? styles.levelSelected
              : undefined
        }
        interactive={true}
        bounds={level_bounds}
        url={
          area_found
            ? `/custom_maps/${level.name}.png`
            : `/gameassets/maps/sprMap_${level.name}_0.png`
        }
        key={level.name}
        alt={level.name}
        eventHandlers={{
          click: (event) => {
            for (const elem of document.getElementsByClassName(
              styles.levelSelected,
            )) {
              elem.classList.remove(styles.levelSelected);
              elem.classList.remove(styles.bigLevelSelected);
            }
            setBeastiesLevel(show_beasties ? "" : level.name);
            if (!show_beasties) {
              event.target._image.classList.add(styles.levelSelected);
              if (level.name == "ocean") {
                event.target._image.classList.add(styles.bigLevelSelected);
              }
            }
          },
        }}
      />,
    );

    if (!show_beasties || !level.has_spawns) {
      return;
    }
    const group = SPAWN_DATA[level.spawn_name[0]]?.group;
    if (!group) {
      return;
    }
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
    non_dupe_beasties.forEach((value, index) => {
      const beastie = BEASTIE_DATA.get(value);
      if (!beastie) {
        return;
      }
      const isSpoiler =
        spoilerMode == SpoilerMode.OnlySeen && !seenBeasties[beastie.id];
      const alt = `${isSpoiler ? `Beastie #${beastie.number}` : beastie.name} spawn location.`;
      beastieSpawnsOverlays.push(
        <Marker
          key={`${level.name}-${beastie.id}`}
          alt={alt}
          title={alt}
          position={
            Math.max(level_size.x, level_size.y) /
              Math.min(level_size.x, level_size.y) <
            1.5
              ? // square enough, diag
                [
                  -(
                    y +
                    (index + 0.5) * (level_size.y / non_dupe_beasties.length)
                  ),
                  x + (index + 0.5) * (level_size.x / non_dupe_beasties.length),
                ]
              : level_size.x > level_size.y
                ? [
                    -(y + level_size.y / 2),
                    x +
                      (index + 0.5) * (level_size.x / non_dupe_beasties.length),
                  ]
                : [
                    -(
                      y +
                      (index + 0.5) * (level_size.y / non_dupe_beasties.length)
                    ),
                    x + level_size.x / 2,
                  ]
          }
          icon={L.icon({
            iconUrl: isSpoiler
              ? "/gameassets/sprExclam_1.png"
              : `/icons/${beastie.name}.png`,
            className: isSpoiler ? styles.spoilerBeastie : undefined,
            iconSize: [50, 50],
          })}
          eventHandlers={{
            click: () => {
              seenBeasties[beastie.id] = true;
              setSeenBeasties(seenBeasties);
            },
          }}
        >
          <Popup offset={[0, -5]}>
            <Link to={`/beastiepedia/${beastie.name}`}>{beastie.name}</Link>
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
                Variant Chance: {overall_percent[value].variant * 100}%
              </>
            ) : null}
          </Popup>
        </Marker>,
      );
    });
  });

  const inside_overlays: React.ReactElement[] = [];
  for (const area of OTHER_AREAS) {
    inside_overlays.push(
      <ImageOverlay
        key={area.prefix}
        bounds={L.latLngBounds(area.overlay)}
        url={`/custom_maps/${area.prefix}_overlay.png`}
      />,
    );
  }

  const {
    bigtitleheaders,
    titleheaders,
    imgheaders,
  }: {
    bigtitleheaders: React.ReactElement[];
    titleheaders: React.ReactElement[];
    imgheaders: { [key: string]: React.ReactElement[] };
  } = useMemo(createMarkers, []);

  return (
    <>
      <OpenGraph
        title={`Map - ${import.meta.env.VITE_BRANDING}`}
        image="gameassets/sprMainmenu/3.png"
        url="map/"
        description="A map of the world of Beastieball"
      />
      <Header title="Beastieball Map" />
      <MapContainer
        className={styles.map}
        minZoom={-7}
        maxZoom={0}
        maxBounds={bounds.pad(0.25)}
        maxBoundsViscosity={0.3}
        zoom={-5.5}
        center={[0, 0]}
        zoomAnimation={false} // there are seams between the tiles when animating
        zoomSnap={0}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={90}
        bounds={bounds.pad(1)}
        crs={L.CRS.Simple}
      >
        <MapEvents />
        <LayersControl>
          <LayersControl.Overlay checked name="Region Names">
            <LayerGroup>{bigtitleheaders}</LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Area Names">
            <LayerGroup>{titleheaders}</LayerGroup>
          </LayersControl.Overlay>

          {Object.keys(imgheaders).map((key) =>
            key == "Other" && imgheaders[key].length == 0 ? null : (
              <LayersControl.Overlay key={key} checked name={key}>
                <LayerGroup>{imgheaders[key]}</LayerGroup>
              </LayersControl.Overlay>
            ),
          )}
          <LayersControl.Overlay checked name="Beastie Spawns">
            <LayerGroup>{beastieSpawnsOverlays}</LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Items">
            <LayerGroup>
              {EXTRA_MARKERS.gifts.map((gift) => (
                <Marker
                  key={gift.id}
                  position={[-gift.y, gift.x]}
                  icon={L.icon({
                    iconUrl: `/gameassets/sprItems/${ITEM_DIC[gift.items[0][0]].img}.png`,
                    iconSize: [30, 30],
                    iconAnchor: [20, 20],
                  })}
                >
                  <Popup offset={[0, -5]}>
                    <div className={styles.itemList}>
                      {gift.items.map(([item, count]) => (
                        <div key={item} className={styles.item}>
                          <img
                            src={`/gameassets/sprItems/${ITEM_DIC[item].img}.png`}
                          />
                          <div>
                            <span>
                              {ITEM_DIC[item].name} x{count}
                            </span>
                            <TextTag>{ITEM_DIC[item].desc}</TextTag>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Inside Overlays">
            <LayerGroup>{inside_overlays}</LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <LayerGroup>{level_overlays}</LayerGroup>
      </MapContainer>
    </>
  );
}
