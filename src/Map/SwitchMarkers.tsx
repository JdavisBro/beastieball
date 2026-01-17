import * as L from "leaflet";
import { Polyline, Popup } from "react-leaflet";

import styles from "./Map.module.css";
import { EXTRA_MARKERS } from "../data/WorldData";
import DivIconMarker from "./DivIconMarker";
import useLocalization from "../localization/useLocalization";

export default function SwitchMarkers() {
  const { L: Loc } = useLocalization();

  const gate = Loc("map.gate");
  const gateMarker = Loc("map.gateMarker");
  const switchText = Loc("map.switch");
  const switchMarker = Loc("map.switchMarker");

  return [
    EXTRA_MARKERS.switches
      .map((lever, index) => {
        const leverPos = L.latLng(-lever.position[1], lever.position[0]);
        const walls = EXTRA_MARKERS.walls[lever.lever_id];
        const lineCol = `hsl(${Math.floor(Math.abs(lever.position[0] + lever.position[1]) % 360) & 0xaaaaaa}, 100%, 50%)`;
        return [
          <DivIconMarker
            key={`${index}_lever`}
            tagName="div"
            className={styles.imgmarker}
            markerprops={{ position: leverPos }}
            icon={{
              className: styles.hidemarker,
              iconSize: [15, 30],
            }}
            popup={<Popup>{switchText}</Popup>}
          >
            <img src="/map_icon/switch.png" alt={switchMarker} />
          </DivIconMarker>,
          walls.map((wall, wallIndex) => {
            const rad = ((wall.angle - 180) * Math.PI) / 180;
            const gatePos = L.latLng(
              -wall.position[1] + Math.sin(rad) * 125,
              wall.position[0] + Math.cos(rad) * 250,
            );
            return (
              <Polyline
                key={`${index}_line_${wallIndex}`}
                positions={[leverPos, gatePos]}
                weight={6}
                color={lineCol}
              />
            );
          }),
        ];
      })
      .flat(),
    Object.values(EXTRA_MARKERS.walls)
      .flat()
      .map((wall, index) => {
        const rad = ((wall.angle - 180) * Math.PI) / 180;
        const gatePos = L.latLng(
          -wall.position[1] + Math.sin(rad) * 125,
          wall.position[0] + Math.cos(rad) * 250,
        );
        return (
          <DivIconMarker
            key={`${index}_gate`}
            tagName="div"
            className={styles.imgmarker}
            markerprops={{ position: gatePos }}
            icon={{
              className: styles.hidemarker,
              iconSize: [15, 30],
            }}
            popup={<Popup>{gate}</Popup>}
          >
            <img src="/map_icon/gate.png" alt={gateMarker} />
          </DivIconMarker>
        );
      }),
  ];
}
