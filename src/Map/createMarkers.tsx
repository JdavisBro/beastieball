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

export function createMarkers(Loc: LocalizationFunction) {
  const bigtitleheaders: React.ReactElement[] = [];
  const titleheaders: React.ReactElement[] = [];

  const objtypes: { [key: string]: string } = {
    objBallcenter: "beastieballCenter",
    objRailhouse: "railhouse",
    objBoathouse: "railhouse",
    objCamp: "railhouse",
    objGymdoor: "gym",
    objClothesShop: "clothes",
    objZipstation: "railhouse",
    objMall: "railhouse",
  };

  const imgheaders: { [key: string]: React.ReactElement[] } = {
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
    if (value.img) {
      markertype =
        value.is_cave == 1
          ? imgheaders.caves
          : value.from_object
            ? imgheaders[objtypes[value.from_object]]
            : imgheaders.other;
      if (markertype == undefined) {
        markertype = imgheaders.other;
      }
      markerup = <img src={`/gameassets/sprSponsors/${value.img}.png`} />;
      const revealed =
        value.revealed_text &&
        value.revealed_text.replace(
          /(.+?)(?: \((.+?)\)|$)/,
          (_, g1, g2) =>
            `${Loc("_map_" + g1)}${g2 ? ` (${Loc("_map_" + g2)})` : ""}`,
        );
      popup = <Popup>{revealed ? revealed : Loc("_map_" + value.text)}</Popup>;
    } else {
      if (value.from_object == "objHiddenObject") {
        return;
      }
      if (value.has_conditional && value.conditional) {
        if (
          CONDITIONAL_CHECK[value.conditional.key] != value.conditional.value
        ) {
          return;
        }
      }
      containerclass =
        value.superheader == 1 ? styles.bigtextmarker : styles.textmarker;
      markerup = value.text ? <>{Loc("_map_" + value.text)}</> : null;
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
