import { Link } from "react-router-dom";
import * as L from "leaflet";
import { Popup } from "react-leaflet";

import { EncounterDataType } from "../data/EncounterData";
import BEASTIE_DATA, { BeastieType } from "../data/BeastieData";
import styles from "./Map.module.css";
import {
  SpoilerMode,
  useSpoilerMode,
  useSpoilerSeen,
} from "../shared/useSpoiler";
import { EXTRA_MARKERS } from "../data/WorldData";
import DivIconMarker from "./DivIconMarker";
import { useCallback, useRef, useState } from "react";
import useLocalization from "../localization/useLocalization";

const LEVEL_METAMORPHS = [0, 4, 9, 10, 11];

function findMetamorphAtLevel(
  beastie: BeastieType,
  level: number,
  splitPrefer: string,
) {
  if (!beastie.evolution) {
    return null;
  }
  const levelMetamorphs = beastie.evolution.filter((evo) =>
    evo.condition.some((cond) => LEVEL_METAMORPHS.includes(cond)),
  );
  if (!levelMetamorphs.length) {
    return null;
  }
  const possibleLevelMetamorphs = levelMetamorphs.filter(
    (evo) => typeof evo.value[0] == "number" && evo.value[0] <= level,
  );
  if (!possibleLevelMetamorphs.length) {
    return beastie;
  }
  const evo =
    possibleLevelMetamorphs.find((evo) => evo.specie == splitPrefer) ??
    possibleLevelMetamorphs[0];
  const new_beastie = BEASTIE_DATA.get(evo.specie);
  return new_beastie ?? null;
}

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

  const [spoilerMode] = useSpoilerMode();
  const [spoilerSeen, setSpoilerSeen] = useSpoilerSeen();

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
            findMetamorphAtLevel(
              babyBeastieData,
              beastie.level,
              oldBeastieData.id,
            ) ?? oldBeastieData;
          const isWild = beastie.specie == "";
          const isSpoiler =
            isWild ||
            (spoilerMode != SpoilerMode.All && !spoilerSeen[beastieData.id]);

          return (
            <div key={index} className={styles.encounterBeastie}>
              <Link
                to={
                  isWild || isSpoiler
                    ? ""
                    : `/beastiepedia/${Loc(beastieData.name)}`
                }
                onClick={
                  isSpoiler
                    ? () =>
                        setSpoilerSeen((seen) => {
                          seen[beastieData.id] = true;
                          return seen;
                        })
                    : undefined
                }
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
