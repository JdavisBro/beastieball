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
  const level_overlays: { [key: number]: React.ReactElement[] } = {};

  WORLD_DATA.level_stumps_array.forEach((level) => {
    const level_bounds = new L.LatLngBounds(
      [-level.world_y1, level.world_x1],
      [-level.world_y2, level.world_x2],
    );
    const layer = level.world_layer ? level.world_layer : 0;
    let overlays = level_overlays[layer];
    if (!overlays) {
      level_overlays[layer] = [];
      overlays = level_overlays[layer];
    }

    overlays.push(
      <ImageOverlay
        bounds={level_bounds}
        url={`/gameassets/maps/sprMap_${level.name}_0.png`}
        key={level.name}
      />,
    );
  });

  const mapoverlay = (
    <ImageOverlay
      key="background"
      url={"/gameassets/maps/sprMap_BG_0.png"}
      bounds={bounds}
    />
  );

  level_overlays[0]
    ? level_overlays[0].unshift(mapoverlay)
    : (level_overlays[0] = [mapoverlay]);

  const titleheaders: React.ReactElement[] = [];

  const objtypes: { [key: string]: string } = {
    objBallcenter: "Beastieball Center",
    objRailhouse: "Railhouse/Boathouse/Camp",
    objBoathouse: "Railhouse/Boathouse/Camp",
    objCamp: "Railhouse/Boathouse/Camp",
    objGymdoor: "Gym",
    objClothesShop: "Clothes Shop",
    objZipstation: "Zip Station",
  };
  const imgheaders: { [key: string]: React.ReactElement[] } = {
    "Beastieball Center": [],
    "Railhouse/Boathouse/Camp": [],
    Gym: [],
    "Clothes Shop": [],
    "Zip Station": [],
    Caves: [],
    Other: [],
  };

  function GameMarker(props: {
    value: MapIcon;
    markerup: React.ReactElement;
    popup?: React.ReactElement;
    zindex: number;
  }) {
    const value = props.value;
    return (
      <Marker
        key={getKey(value)}
        position={new L.LatLng(-value.world_y, value.world_x)}
        alt={value.revealed_text ? value.revealed_text : value.text}
        zIndexOffset={props.zindex}
        icon={L.divIcon({
          className: styles.hidemarker,
          html: renderToStaticMarkup(props.markerup),
        })}
      >
        <Popup>{props.popup ? props.popup : null}</Popup>
      </Marker>
    );
  }

  function createMarker(value: MapIcon) {
    let markertype = titleheaders;
    let markerup;
    let popup = undefined;
    let zindex = 0;
    if (value.img) {
      markertype =
        value.is_cave == 1
          ? imgheaders["Caves"]
          : value.from_object
            ? imgheaders[objtypes[value.from_object]]
            : imgheaders["Other"];
      if (markertype == undefined) {
        markertype = imgheaders["Other"];
      }
      markerup = (
        <div className={styles.imgmarker}>
          <img src={`/gameassets/sprSponsors/${value.img}.png`} />
        </div>
      );
      popup = <>{value.revealed_text ? value.revealed_text : value.text}</>;
    } else {
      markerup = <div className={styles.textmarker}>{value.text}</div>;
      zindex = 1000;
    }
    markertype.push(
      <GameMarker
        value={value}
        markerup={markerup}
        popup={popup}
        zindex={zindex}
      />,
    );
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
        <LayersControl.Overlay checked name="Area Titles">
          <LayerGroup>{titleheaders}</LayerGroup>
        </LayersControl.Overlay>
        {Object.keys(imgheaders).map((key) => (
          <LayersControl.Overlay key={key} checked name={key}>
            <LayerGroup>{imgheaders[key]}</LayerGroup>
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
}
