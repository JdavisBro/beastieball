import * as L from "leaflet";
import { Popup } from "react-leaflet";
import styles from "./Map.module.css";
import WORLD_DATA, { MapIcon } from "../data/WorldData";
import DivIconMarker from "./DivIconMarker";

function getKey(icon: MapIcon) {
  if (icon.is_cave) {
    return (
      (icon.from_level ?? "?") +
      (icon.cave_loc_a ?? "?") +
      (icon.cave_loc_b ?? "?")
    );
  }
  return (
    icon.from_level +
    (icon.text ? icon.text : "") +
    (icon.from_object_guid ? icon.from_object_guid : "")
  );
}

const CONDITIONAL_CHECK: Record<string, number> = {
  region_discovered_mtn: 1,
};

const railhouseStr = "Railhouse / Boathouse /\nCamp / Zip Station";

export function createMarkers() {
  const bigtitleheaders: React.ReactElement[] = [];
  const titleheaders: React.ReactElement[] = [];

  const objtypes: { [key: string]: string } = {
    objBallcenter: "Beastieball Center",
    objRailhouse: railhouseStr,
    objBoathouse: railhouseStr,
    objCamp: railhouseStr,
    objGymdoor: "Gym",
    objClothesShop: "Clothes Shop",
    objZipstation: railhouseStr,
    objMall: railhouseStr,
  };

  const imgheaders: { [key: string]: React.ReactElement[] } = {
    "Beastieball Center": [],
    [railhouseStr]: [],
    Gym: [],
    "Clothes Shop": [],
    Caves: [],
    Other: [],
  };

  function createMarker(value: MapIcon) {
    let containerclass = styles.imgmarker;
    let markertype = value.superheader == 1 ? bigtitleheaders : titleheaders;
    let markerup: React.ReactElement | null;
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
      markerup = <img src={`/gameassets/sprSponsors/${value.img}.png`} />;
      popup = (
        <Popup>{value.revealed_text ? value.revealed_text : value.text}</Popup>
      );
    } else {
      if (value.has_conditional && value.conditional) {
        if (
          CONDITIONAL_CHECK[value.conditional.key] != value.conditional.value
        ) {
          return;
        }
      }
      containerclass =
        value.superheader == 1 ? styles.bigtextmarker : styles.textmarker;
      markerup = value.text ? <>{value.text}</> : null;
      zindex = value.superheader == 1 ? 1100 : 1000;
    }

    markertype.push(
      <DivIconMarker
        key={getKey(value)}
        markerprops={{
          position: new L.LatLng(-value.world_y, value.world_x),
          alt: value.revealed_text ? value.revealed_text : value.text,
          zIndexOffset: zindex,
        }}
        tagName="div"
        className={containerclass}
        icon={{ className: styles.hidemarker }}
        popup={popup}
      >
        {markerup}
      </DivIconMarker>,
    );
  }

  WORLD_DATA.icons_array.forEach(createMarker);
  WORLD_DATA.level_stumps_array.forEach((value) => {
    if (!value.world_layer) {
      value.icons_array.forEach(createMarker);
    }
  });

  return { bigtitleheaders, titleheaders, imgheaders };
}
