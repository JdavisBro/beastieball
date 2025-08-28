import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import {
  ImageOverlay,
  LayerGroup,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useCallback, useMemo, useRef, useState } from "react";

import WORLD_DATA, { EXTRA_MARKERS } from "../data/WorldData";
import styles from "./Map.module.css";
import OpenGraph from "../shared/OpenGraph";
import { createMarkers } from "./createMarkers";
import Header from "../shared/Header";
import SPAWN_DATA from "../data/SpawnData";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import ITEM_DIC from "../data/ItemData";
import TextTag from "../shared/TextTag";
import { useIsSpoiler } from "../shared/useSpoiler";
import OTHER_AREAS from "./OtherLayerAreas";
import SpecialBeastieMarker from "./SpecialBeastieMarker";
import { EXTINCT_BEASTIES, METAMORPH_LOCATIONS } from "./SpecialBeasties";
import DivIconMarker from "./DivIconMarker";
import createBeastieBox from "./createBeastieBox";
import { ControlMenu } from "./ControlMenu";
import EncounterPopup from "./EncounterPopup";
import { EncounterDataType } from "../data/EncounterData";

const secrets = localStorage.getItem("secrets") == "true";

const BEASTIE_ARRAY = [...BEASTIE_DATA.values()];

export const SPAWNABLE_BEASTIES = Object.values(SPAWN_DATA)
  .map((spawns) => spawns.group?.map((spawn) => spawn.specie))
  .flat()
  .filter((beastie) => typeof beastie === "string")
  .filter((beastie, index, array) => index == array.indexOf(beastie));

function MapEvents() {
  useMapEvents({
    popupopen: (event) =>
      event.popup.getElement()?.classList.remove("leaflet-popup-closing"),
    popupclose: (event) =>
      event.popup.getElement()?.classList.add("leaflet-popup-closing"),
    click: import.meta.env.DEV
      ? (event) => console.log(event.latlng)
      : undefined,
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

  const [isSpoiler, setSeen] = useIsSpoiler();

  const [postgame, setPostgame] = useState(false);
  const [attractSpray, setAttractSpray] = useState(false);

  const setQueryParam = (key: string, value?: string) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    url.hash = "";
    if (url.toString() != window.location.href) {
      history.pushState({}, "", url.toString());
    }
  };

  const searchParams = new URL(window.location.href).searchParams;
  const searchHuntedName = searchParams.get("track");
  const searchHunted = BEASTIE_ARRAY.find(
    (beastie) => beastie.name == searchHuntedName,
  )?.id;

  const [huntedBeastie, setHuntedBeastieState] = useState<string | undefined>(
    searchHunted && SPAWNABLE_BEASTIES.includes(searchHunted)
      ? searchHunted
      : undefined,
  );
  const setHuntedBeastie = (beastieId?: string) => {
    setHuntedBeastieState(beastieId);
    setQueryParam(
      "track",
      beastieId ? BEASTIE_DATA.get(beastieId)?.name : undefined,
    );
  };

  const [beastiesLevel, setBeastiesLevel] = useState("");

  const searchItemName = searchParams.get("item");
  const searchItemId =
    searchItemName &&
    Object.values(ITEM_DIC).find((item) => searchItemName == item.name)?.id;
  const [huntedItem, setHuntedItemState] = useState<string | undefined>(
    searchItemId ?? undefined,
  );
  const setHuntedItem = (itemId?: string) => {
    setHuntedItemState(itemId);
    setQueryParam("item", itemId ? ITEM_DIC[itemId]?.name : undefined);
  };

  WORLD_DATA.level_stumps_array.forEach((level) => {
    const level_size = {
      x: level.world_x2 - level.world_x1,
      y: level.world_y2 - level.world_y1,
    };
    let x = level.world_x1;
    let y = level.world_y1;

    if (level.map_hidden || level.area_id == undefined) {
      // also hide alleyway until it changes when it'll probably get a area_id
      return;
    }

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
    const beastie_filter = beastiesLevel == level.name ? "all" : huntedBeastie;

    level_overlays.push(
      <ImageOverlay
        className={
          level.name == "ocean"
            ? styles.bigLevel
            : level.name == "pirate_island"
              ? styles.goBehind
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

    if ((!show_beasties && !beastie_filter) || !level.has_spawns) {
      return;
    }
    const groups = level.spawn_name.map(
      (spawn_name) =>
        (
          (postgame && SPAWN_DATA[spawn_name + "_postgame"]) ||
          SPAWN_DATA[spawn_name]
        )?.group,
    );
    const horizontal = level_size.x > level_size.y;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (!group) {
        return;
      }
      const pos = { x, y };
      const size = { x: level_size.x, y: level_size.y };
      if (groups.length == 2) {
        if (horizontal) {
          size.x *= i == 1 ? 0.34 : 0.66;
          pos.x += i == 1 ? 0 : level_size.x * 0.34;
        } else {
          size.y *= i == 1 ? 0.34 : 0.66;
          pos.y += i == 1 ? 0 : level_size.y * 0.34;
        }
      }
      beastieSpawnsOverlays.push(
        ...createBeastieBox(
          group,
          pos,
          size,
          `${level.name}-${level.spawn_name[i]}`,
          beastie_filter,
          isSpoiler,
          setSeen,
          huntedBeastie,
          attractSpray,
        ),
      );
    }
  });

  const inside_overlays: React.ReactElement[] = [];
  for (const area of OTHER_AREAS) {
    inside_overlays.push(
      <ImageOverlay
        key={area.prefix}
        className={styles.insideOverlay}
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

  const extinctIsSpoiler = !EXTINCT_BEASTIES.some(
    (extinct) => !isSpoiler(extinct.beastieId),
  );

  const marker_name = searchParams.get("marker");
  const marker = marker_name
    ? METAMORPH_LOCATIONS.find(
        (value) => BEASTIE_DATA.get(value.to)?.name == marker_name,
      ) ||
      EXTINCT_BEASTIES.find(
        (value) => BEASTIE_DATA.get(value.beastieId)?.name == marker_name,
      )
    : undefined;
  const center = marker ? marker.position : L.latLng(0, 0);
  const zoom = marker ? -4 : -5.5;

  const [encounterData, setEncounterData] = useState<
    EncounterDataType | undefined
  >(undefined);
  const loadingEncounterDataRef = useRef(false);

  const loadEncounterData = useCallback(() => {
    if (loadingEncounterDataRef.current) {
      return;
    }
    loadingEncounterDataRef.current = true;
    import("../data/EncounterData").then((data) =>
      setEncounterData(data.default),
    );
  }, []);

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
        zoom={zoom}
        center={center}
        zoomAnimation={false} // there are seams between the tiles when animating
        zoomSnap={0}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={90}
        bounds={bounds.pad(1)}
        crs={L.CRS.Simple}
      >
        <MapEvents />
        <LayerGroup>{level_overlays}</LayerGroup>
        <ControlMenu
          layers={[
            {
              category: "Text",
              title: "Region Names",
              children: bigtitleheaders,
            },
            {
              title: "Area Names",
              children: titleheaders,
            },
            ...Object.keys(imgheaders)
              .map((key, index) =>
                key == "Other" && imgheaders[key].length == 0
                  ? null
                  : {
                      category: index == 0 ? "Markers" : undefined,
                      title: key,
                      children: imgheaders[key],
                    },
              )
              .filter((layer) => !!layer),
            {
              category: "Beasties",
              title: "Beastie Spawns",
              children: beastieSpawnsOverlays,
            },
            {
              title: `${extinctIsSpoiler ? "???" : "Extinct"} Beastie Locations`,
              children: EXTINCT_BEASTIES.map((extinct) => (
                <SpecialBeastieMarker
                  key={extinct.beastieId}
                  open={
                    extinct.beastieId ==
                    (marker && "beastieId" in marker
                      ? marker.beastieId
                      : undefined)
                  }
                  position={extinct.position}
                  target={BEASTIE_DATA.get(extinct.beastieId) as BeastieType}
                />
              )),
            },
            {
              title: "Metamorphosis Locations",
              children: METAMORPH_LOCATIONS.map((metamorph) => (
                <SpecialBeastieMarker
                  key={metamorph.to}
                  open={
                    metamorph.to ==
                    (marker && "to" in marker ? marker.to : undefined)
                  }
                  position={metamorph.position}
                  target={BEASTIE_DATA.get(metamorph.to) as BeastieType}
                  metamorph={{
                    from: BEASTIE_DATA.get(metamorph.from) as BeastieType,
                    by: metamorph.by,
                  }}
                />
              )),
            },
            secrets
              ? {
                  title: "Encounters",
                  children: EXTRA_MARKERS.encounters.map((encounter) => (
                    <DivIconMarker
                      key={`${encounter.position[0]}-${encounter.position[1]}-${encounter.encounter}`}
                      tagName="div"
                      icon={{
                        className: styles.hidemarker,
                        iconSize: [15, 30],
                      }}
                      markerprops={{
                        position: L.latLng(
                          -encounter.position[1],
                          encounter.position[0],
                        ),
                      }}
                      className={styles.encounterImgmarker}
                      popup={
                        <Popup>
                          <EncounterPopup
                            encounterId={encounter.encounter}
                            encounterData={encounterData}
                            loadEncounterData={loadEncounterData}
                          />
                        </Popup>
                      }
                    >
                      <img
                        src="/gameassets/sprSponsors/5.png"
                        alt="Encounter Marker"
                      />
                    </DivIconMarker>
                  )),
                }
              : undefined,
            {
              category: "Exploration",
              title: "Inside Overlays",
              children: inside_overlays,
            },
            {
              title: "Items",
              children: EXTRA_MARKERS.gifts
                .filter(
                  (gift) =>
                    !huntedItem ||
                    gift.items.some((item) => item[0] == huntedItem),
                )
                .map((gift) => (
                  <Marker
                    key={gift.id}
                    position={[-gift.y, gift.x]}
                    icon={L.icon({
                      iconUrl: `/gameassets/sprItems/${ITEM_DIC[gift.items[0][0]].img}.png`,
                      iconSize: huntedItem ? [60, 60] : [30, 30],
                      iconAnchor: huntedItem ? [30, 30] : [15, 15],
                      className: huntedItem ? styles.itemHunted : undefined,
                    })}
                  >
                    <Popup offset={[0, -5]} minWidth={300}>
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
                )),
            },
            {
              title: "Switches and Gates",
              children: [
                EXTRA_MARKERS.switches
                  .map((lever, index) => {
                    const leverPos = L.latLng(
                      -lever.position[1],
                      lever.position[0],
                    );
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
                        popup={<Popup>Switch</Popup>}
                      >
                        <img src="/map_icon/switch.png" alt="Switch Marker" />
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
                        popup={<Popup>Gate</Popup>}
                      >
                        <img src="/map_icon/gate.png" alt="Gate Marker" />
                      </DivIconMarker>
                    );
                  }),
              ],
            },
          ].filter((layer) => layer !== undefined)}
          huntedBeastie={huntedBeastie}
          setHuntedBeastie={setHuntedBeastie}
          postgame={postgame}
          setPostgame={setPostgame}
          attractSpray={attractSpray}
          setAttractSpray={setAttractSpray}
          huntedItem={huntedItem}
          setHuntedItem={setHuntedItem}
        />
      </MapContainer>
    </>
  );
}
