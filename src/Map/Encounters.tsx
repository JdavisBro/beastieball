import { Link } from "react-router-dom";
import * as L from "leaflet";
import { Popup } from "react-leaflet";

import { EncounterDataType } from "../data/EncounterData";
import BEASTIE_DATA from "../data/BeastieData";
import styles from "./Map.module.css";
import { useIsSpoiler } from "../shared/useSpoiler";
import { EXTRA_MARKERS } from "../data/WorldData";
import DivIconMarker from "./DivIconMarker";
import { useCallback, useRef, useState } from "react";
import useLocalization from "../localization/useLocalization";
import getMetamorphAtLevel from "../Team/Encounters/getMetamorphAtLevel";

function EncounterPopup({
  encounterId,
  encounterData,
  loadEncounterData,
}: {
  encounterId: string;
  encounterData: EncounterDataType | undefined;
  loadEncounterData: () => void;
}) {
  const { L: Loc, getLink } = useLocalization();

  const [isSpoilerFn, setSeen] = useIsSpoiler();

  if (!encounterData) {
    loadEncounterData();
    return <div>{Loc("map.encounterPopup.loadingEncounters")}</div>;
  }
  const encounter = encounterData[encounterId];
  if (!encounter) {
    return (
      <div>{Loc("map.encounterPopup.encounterNotFound", { encounterId })}</div>
    );
  }

  return (
    <div className={styles.encounter}>
      <div className={styles.encounterTeam}>
        {encounter.team.map((beastie, index) => {
          const oldBeastieData = BEASTIE_DATA.get(beastie.specie || "shroom1");
          if (!oldBeastieData) {
            return null;
          }
          const babyBeastieData = BEASTIE_DATA.get(oldBeastieData.family);
          if (!babyBeastieData) {
            return null;
          }
          const beastieData =
            getMetamorphAtLevel(
              babyBeastieData,
              beastie.level,
              oldBeastieData.id,
            ) ?? oldBeastieData;
          const isWild = beastie.specie == "";
          const isSpoiler = isWild || isSpoilerFn(beastie.specie);

          return (
            <div key={index} className={styles.encounterBeastie}>
              <Link
                to={
                  isWild || isSpoiler
                    ? ""
                    : `/beastiepedia/${Loc(beastieData.name)}`
                }
                onClick={isSpoiler ? () => setSeen(beastieData.id) : undefined}
              >
                <img
                  src={
                    isSpoiler
                      ? "/gameassets/sprExclam_1.png"
                      : `/icons/${Loc(beastieData.name, {}, true)}.png`
                  }
                  alt={
                    isWild
                      ? ""
                      : isSpoiler
                        ? Loc("common.hiddenBeastie")
                        : Loc(beastieData.name)
                  }
                />
              </Link>
              <div>
                {Loc(
                  (beastie.name ?? "") ||
                    (isWild
                      ? "map.encounterPopup.wild"
                      : isSpoiler
                        ? "common.spoiler"
                        : beastieData.name),
                )}
              </div>
              <div>
                {Loc("map.encounterPopup.lvl", {
                  level: String(beastie.level),
                })}
              </div>
            </div>
          );
        })}
      </div>
      {encounter.scales ? (
        <div>{Loc("map.encounterPopup.scalingNote")}</div>
      ) : null}
      <Link to={getLink(`/team/encounters/${encounter.id}`)}>
        {Loc("map.encounterPopup.moreDetailsLink")}
      </Link>
    </div>
  );
}

export default function Encounters() {
  const { L: Loc } = useLocalization();

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

  const encounterMarker = Loc("map.encounterMarker");

  return EXTRA_MARKERS.encounters.map((encounter) => (
    <DivIconMarker
      key={`${encounter.position[0]}-${encounter.position[1]}-${encounter.encounter}`}
      tagName="div"
      icon={{
        className: styles.hidemarker,
        iconSize: [15, 30],
      }}
      markerprops={{
        position: L.latLng(-encounter.position[1], encounter.position[0]),
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
      <img src="/gameassets/sprSponsors/5.png" alt={encounterMarker} />
    </DivIconMarker>
  ));
}
