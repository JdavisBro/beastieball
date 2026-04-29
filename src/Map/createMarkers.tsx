import * as L from "leaflet";
import { Popup } from "react-leaflet";
import styles from "./Map.module.css";
import WORLD_DATA, { MapIcon } from "../data/WorldData";
import DivIconMarker from "./DivIconMarker";
import { LocalizationFunction } from "../localization/useLocalization";

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

type ObjectNames =
  | "objBallcenter"
  | "objRailhouse"
  | "objBoathouse"
  | "objCamp"
  | "objGymdoor"
  | "objClothesShop"
  | "objZipstation"
  | "objMall";

type MarkerNames =
  | "beastieballCenter"
  | "railhouse"
  | "gym"
  | "clothes"
  | "caves"
  | "other";

const objtypes: Record<ObjectNames, MarkerNames> = {
  objBallcenter: "beastieballCenter",
  objRailhouse: "railhouse",
  objBoathouse: "railhouse",
  objCamp: "railhouse",
  objGymdoor: "gym",
  objClothesShop: "clothes",
  objZipstation: "railhouse",
  objMall: "railhouse",
};

export function createMarkers(Loc: LocalizationFunction) {
  const bigtitleheaders: React.ReactElement[] = [];
  const titleheaders: React.ReactElement[] = [];

  const imgheaders: Record<MarkerNames, React.ReactElement[]> = {
    beastieballCenter: [],
    railhouse: [],
    gym: [],
    clothes: [],
    caves: [],
    other: [],
  };

  function createMarker(value: MapIcon) {
    let containerclass = styles.imgmarker;
    let markertype = value.superheader == 1 ? bigtitleheaders : titleheaders;
    let markerup: React.ReactElement | null;
    let popup = undefined;
    let zindex = 0;
    const revealed =
      value.revealed_text &&
      value.revealed_text.replace(
        /(.+?)(?: \((.+?)\)|$)/,
        (_, g1, g2) =>
          `${Loc("_map_" + g1)}${g2 ? ` (${Loc("_map_" + g2)})` : ""}`,
      );
    const text = value.text && Loc("_map_" + value.text);
    if (value.img) {
      if (value.from_object == "objBallcenter") return;
      markertype =
        value.is_cave == 1
          ? imgheaders.caves
          : value.from_object
            ? imgheaders[objtypes[value.from_object as ObjectNames]]
            : imgheaders.other;
      if (markertype == undefined) {
        markertype = imgheaders.other;
      }
      markerup = <img src={`/gameassets/sprSponsors/${value.img}.png`} />;
      popup = <Popup>{revealed ? revealed : text}</Popup>;
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
      markerup = text ? <>{text}</> : null;
      zindex = value.superheader == 1 ? 1100 : 1000;
    }

    markertype.push(
      <DivIconMarker
        key={getKey(value)}
        markerprops={{
          position: new L.LatLng(-value.world_y, value.world_x),
          alt: revealed ? revealed : text,
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
  Object.entries(WORLD_DATA.map_position_data).forEach(([key, position]) => {
    if (key.endsWith("objBallcenter")) {
      imgheaders.beastieballCenter.push(
        <DivIconMarker
          key={key}
          markerprops={{
            position: new L.LatLng(-position.y, position.x),
            alt: Loc("_map_Beastieball Center"),
          }}
          tagName="div"
          className={styles.imgmarker}
          icon={{ className: styles.hidemarker }}
          popup={<Popup>{Loc("_map_Beastieball Center")}</Popup>}
        >
          <img src="/gameassets/sprSponsors/5.png" />
        </DivIconMarker>,
      );
    }
  });

  return { bigtitleheaders, titleheaders, imgheaders };
}
