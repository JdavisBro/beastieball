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

import WORLD_DATA from "../data/WorldData";
import styles from "./Map.module.css";
import OpenGraph from "../shared/OpenGraph";
import { createMarkers } from "./createMarkers";
import Header from "../shared/Header";
import SPAWN_DATA from "../data/SpawnData";
import BEASTIE_DATA from "../data/Beastiedata";

function MapEvents(props: {
  setCurrentMapLayer: React.Dispatch<React.SetStateAction<number>>;
}) {
  useMapEvents({
    baselayerchange: (event) =>
      event.name == "Surface"
        ? props.setCurrentMapLayer(0)
        : props.setCurrentMapLayer(Number(event.name.replace("Layer ", ""))),
  });

  return null;
}

export default function Map(): React.ReactNode {
  const [currentMapLayer, setCurrentMapLayer] = useState(0);

  // these are estimates based on comparing the map to a screenshot but they should be about right for now
  const bounds = new L.LatLngBounds([83000, -160000], [-42333, 14762]);
  const map_bg_bounds = new L.LatLngBounds([83000, -160000], [-42333, 14762]);
  const level_overlays: { [key: number]: React.ReactElement[] } = {};

  const beastieSpawnsOverlays: { [key: number]: React.ReactElement[] } = {};

  WORLD_DATA.level_stumps_array.forEach((level) => {
    const level_bounds = new L.LatLngBounds(
      [-level.world_y1, level.world_x1],
      [-level.world_y2, level.world_x2],
    );
    const layer = level.world_layer ? level.world_layer : 0;
    if (layer == currentMapLayer) {
      bounds.extend(level_bounds);
    }
    let overlays = level_overlays[layer];
    if (!overlays) {
      level_overlays[layer] = [];
      overlays = level_overlays[layer];
    }

    overlays.push(
      <ImageOverlay
        interactive={true}
        bounds={level_bounds}
        url={`/gameassets/maps/sprMap_${level.name}_0.png`}
        key={level.name}
      />,
    );

    if (!level.has_spawns) {
      return;
    }
    let spawns = beastieSpawnsOverlays[layer];
    if (!spawns) {
      beastieSpawnsOverlays[layer] = [];
      spawns = beastieSpawnsOverlays[layer];
    }
    const group = SPAWN_DATA[level.spawn_name[0]]?.group;
    if (!group) {
      return;
    }
    const overall_percent: {
      [key: string]: { percent: number; levelMin: number; levelMax: number };
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
        };
      }
    });
    const level_size = {
      x: level.world_x2 - level.world_x1,
      y: level.world_y2 - level.world_y1,
    };
    non_dupe_beasties.forEach((value, index) => {
      const beastie = BEASTIE_DATA.get(value);
      if (!beastie) {
        return;
      }
      spawns.push(
        <Marker
          key={`${level.name}-${beastie.id}`}
          alt={`${beastie.name} spawn location.`}
          position={
            Math.max(level_size.x, level_size.y) /
              Math.min(level_size.x, level_size.y) <
            1.5
              ? // square enough, diag
                [
                  -(
                    level.world_y1 +
                    (index + 0.5) * (level_size.y / non_dupe_beasties.length)
                  ),
                  level.world_x1 +
                    (index + 0.5) * (level_size.x / non_dupe_beasties.length),
                ]
              : level_size.x > level_size.y
                ? [
                    -(level.world_y1 + level_size.y / 2),
                    level.world_x1 +
                      (index + 0.5) * (level_size.x / non_dupe_beasties.length),
                  ]
                : [
                    -(
                      level.world_y1 +
                      (index + 0.5) * (level_size.y / non_dupe_beasties.length)
                    ),
                    level.world_x1 + level_size.x / 2,
                  ]
          }
          icon={L.icon({
            iconUrl: `/icons/${beastie.name}.png`,
            iconSize: [50, 50],
          })}
        >
          <Popup>
            <Link to={`/beastiepedia/${beastie.name}`}>{beastie.name}</Link>
            <br />
            {overall_percent[value].percent > 0
              ? overall_percent[value].percent
              : "???"}
            %
            <br />
            Level {overall_percent[value].levelMin} -{" "}
            {overall_percent[value].levelMax}
          </Popup>
        </Marker>,
      );
    });
  });

  const mapoverlay = (
    <ImageOverlay
      key="background"
      url={"/gameassets/maps/sprMap_BG_0.png"}
      bounds={map_bg_bounds}
    />
  );

  level_overlays[0]
    ? level_overlays[0].unshift(mapoverlay)
    : (level_overlays[0] = [mapoverlay]);

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
        url="map"
        description="A map of the world of Beastieball"
      />
      <Header title="Beastieball Map" />
      <MapContainer
        className={styles.map}
        minZoom={-7.25}
        maxZoom={0}
        maxBounds={bounds.pad(0.25)}
        maxBoundsViscosity={0.7}
        zoom={-6}
        center={[0, 0]}
        zoomAnimation={false} // there are seams between the tiles when animating
        zoomSnap={0}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={90}
        bounds={bounds}
        crs={L.CRS.Simple}
      >
        <MapEvents setCurrentMapLayer={setCurrentMapLayer} />
        <LayersControl>
          {Object.keys(level_overlays).map((key, index) => (
            <LayersControl.BaseLayer
              key={key}
              checked={index == 0}
              name={index == 0 ? "Surface" : `Layer ${index}`}
            >
              <LayerGroup>{level_overlays[Number(key)]}</LayerGroup>
            </LayersControl.BaseLayer>
          ))}
          <LayersControl.Overlay checked name="Region Names">
            <LayerGroup>
              {currentMapLayer == 0 ? bigtitleheaders : null}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Area Names">
            <LayerGroup>
              {currentMapLayer == 0 ? titleheaders : null}
            </LayerGroup>
          </LayersControl.Overlay>

          {Object.keys(imgheaders).map((key) =>
            key == "Other" && imgheaders[key].length == 0 ? null : (
              <LayersControl.Overlay key={key} checked name={key}>
                <LayerGroup>
                  {currentMapLayer == 0 ? imgheaders[key] : null}
                </LayerGroup>
              </LayersControl.Overlay>
            ),
          )}
          <LayersControl.Overlay checked name={"Beastie Spawns"}>
            <LayerGroup>
              {beastieSpawnsOverlays[currentMapLayer]
                ? beastieSpawnsOverlays[currentMapLayer]
                : null}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </>
  );
}
