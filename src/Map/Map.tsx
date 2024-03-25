import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import {
  ImageOverlay,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
} from "react-leaflet";

import styles from "./Map.module.css";
import WORLD_DATA, { MapIcon } from "../data/WorldData";
import SPRITE_INFO from "../data/SpriteInfo";
import { renderToStaticMarkup } from "react-dom/server";

function getKey(icon: MapIcon) {
  if (icon.is_cave) {
    return icon.from_level + icon.cave_loc_a + icon.cave_loc_b;
  }
  return (
    icon.from_level +
    (icon.text ? icon.text : "") +
    (icon.from_object_guid ? icon.from_object_guid : "")
  );
}

export default function Map(): React.ReactNode {
  // these are estimates based on comparing the map to a screenshot but they should be about right for now
  const bounds = new L.LatLngBounds([83000, -160000], [-42333, 14762]);
  const level_overlays = WORLD_DATA.level_stumps_array.map((level) => {
    const sprite = SPRITE_INFO.find(
      (value) => value.name == `sprMap_${level.name}`,
    );
    if (!sprite) {
      return null;
    }
    const level_bounds = new L.LatLngBounds(
      [-level.world_y1, level.world_x1],
      [-level.world_y2, level.world_x2],
    );

    return (
      <ImageOverlay
        bounds={level_bounds}
        url={`/gameassets/maps/sprMap_${level.name}_0.png`}
        key={level.name}
      />
    );
  });

  const titleheaders: React.ReactElement[] = [];
  const imgheaders: React.ReactElement[] = [];

  function createMarker(value: MapIcon) {
    if (value.img) {
      imgheaders.push(
        <Marker
          key={getKey(value)}
          position={new L.LatLng(-value.world_y, value.world_x)}
          alt={value.revealed_text ? value.revealed_text : value.text}
          icon={L.divIcon({
            className: styles.hidemarker,
            html: renderToStaticMarkup(
              <div className={styles.imgmarker}>
                <img src={`/gameassets/sprSponsors/${value.img}.png`} />
              </div>,
            ),
          })}
        >
          <Popup>
            {value.revealed_text ? value.revealed_text : value.text}
          </Popup>
        </Marker>,
      );
    } else {
      titleheaders.push(
        <Marker
          key={getKey(value)}
          position={new L.LatLng(-value.world_y, value.world_x)}
          alt={value.revealed_text ? value.revealed_text : value.text}
          zIndexOffset={100}
          icon={L.divIcon({
            className: styles.hidemarker,
            html: renderToStaticMarkup(
              <div className={styles.textmarker}>{value.text}</div>,
            ),
          })}
        />,
      );
    }
  }

  WORLD_DATA.icons_array.forEach(createMarker);
  WORLD_DATA.level_stumps_array.forEach((value) =>
    value.icons_array.forEach(createMarker),
  );

  return (
    <MapContainer
      minZoom={-7}
      maxZoom={0}
      maxBounds={bounds}
      maxBoundsViscosity={0.7}
      zoom={-5}
      zoomAnimation={false} // there are seams between the tiles when animating
      zoomSnap={0}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={90}
      bounds={bounds}
      crs={L.CRS.Simple}
      style={{ height: "100%" }}
    >
      <ImageOverlay url={"/gameassets/maps/sprMap_BG_0.png"} bounds={bounds} />
      {level_overlays}
      <LayersControl>
        <LayersControl.Overlay checked name="Area Titles">
          <LayerGroup>{titleheaders}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Pins">
          <LayerGroup>{imgheaders}</LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
