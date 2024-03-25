import * as L from "leaflet";
import { Popup } from "react-leaflet";
import styles from "./Map.module.css";
import WORLD_DATA, { MapIcon } from "../data/WorldData";
import { getKey } from "./Map";
import DivIconMarker from "./DivIconMarker";

export function createMarkers() {
  const bigtitleheaders: React.ReactElement[] = [];
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
      <DivIconMarker
        markerprops={{
          position: new L.LatLng(-value.world_y, value.world_x),
          alt: value.revealed_text ? value.revealed_text : value.text,
          zIndexOffset: props.zindex,
        }}
        container={{ tagName: "div", className: styles.hidemarker }}
      >
        {props.markerup}
        {props.popup ? <Popup>{props.popup}</Popup> : null}
      </DivIconMarker>
    );
  }

  function createMarker(value: MapIcon) {
    let markertype = value.superheader == 1 ? bigtitleheaders : titleheaders;
    let markerup: React.ReactElement;
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
      markerup = (
        <div
          className={
            value.superheader == 1 ? styles.bigtextmarker : styles.textmarker
          }
        >
          {value.text}
        </div>
      );
      zindex = value.superheader == 1 ? 1100 : 1000;
    }

    markertype.push(
      <GameMarker
        key={getKey(value)}
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

  return { bigtitleheaders, titleheaders, imgheaders };
}
