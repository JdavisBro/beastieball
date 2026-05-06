import { Html } from "@react-three/drei";
import type { GameObject, GameObjectTypes, LevelData, Model } from "./types";
import { useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader, NearestFilter } from "three";

import styles from "./LevelEditor.module.css";
import SPRITE_INFO_FULL from "../../data/raw/sprite_info_full.json";
import { Sprite } from "../../data/SpriteInfo";
import { findFloorPosition } from "./LevelEditor";
import { ModelElem } from "./Models";

type DrawerProps = {
  object: GameObject;
  position: [number, number, number];
  levelData: LevelData;
};

function CharacterDrawer({
  position,
  sprite,
  index,
  path,
}: { sprite: string; index?: string; path?: string } & DrawerProps) {
  const texture = useLoader(
    TextureLoader,
    path ??
      `${import.meta.env.VITE_DATA_URL}sprites/${sprite}/${index ?? 0}.png`,
  );
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;

  const sprite_data = SPRITE_INFO_FULL[
    sprite as keyof typeof SPRITE_INFO_FULL
  ] as Sprite;

  return (
    <mesh
      position={[
        position[0],
        position[1],
        position[2] + sprite_data.height / 4,
      ]}
      rotation={[Math.PI / 2, Math.PI, 0]}
    >
      <planeGeometry args={[sprite_data.width / 2, sprite_data.height / 2]} />
      <meshBasicMaterial map={texture} side={DoubleSide} transparent />
    </mesh>
  );
}

function ModelDrawer({ model, levelData }: { model: Model } & DrawerProps) {
  return <ModelElem model={model} levelData={levelData} />;
}

function TextDrawer({ position, object }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Html ref={ref} position={position} className={styles.label}>
        {object.name && object.name != object.name ? (
          <>
            {object.name} - {object.name}
          </>
        ) : (
          object.object
        )}
      </Html>
      <mesh
        position={[position[0], position[1], position[2] + 24]}
        onClick={() => console.log(object)}
        onPointerEnter={() => ref.current?.classList.add(styles.labelVisible)}
        onPointerLeave={() =>
          ref.current?.classList.remove(styles.labelVisible)
        }
      >
        <sphereGeometry args={[24]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </>
  );
}

const OBJECT_DRAWER_MAP: Record<
  GameObjectTypes,
  ((props: DrawerProps) => React.ReactNode) | undefined
> = {
  // MARK: Characters
  objPlayer: undefined,
  objRiley: (props) => <CharacterDrawer {...props} sprite="sprRiley" />,
  objRedd: (props) => <CharacterDrawer {...props} sprite="sprRedd" />,
  objRiven: (props) => <CharacterDrawer {...props} sprite="sprRiven" />,
  objDad: (props) => <CharacterDrawer {...props} sprite="sprDad" />,
  objKaz: (props) => <CharacterDrawer {...props} sprite="sprKaz" />,
  objKing: (props) => <CharacterDrawer {...props} sprite="sprKing" />,
  objMask: (props) => <CharacterDrawer {...props} sprite="sprMask" />,
  objResearcher: (props) => (
    <CharacterDrawer {...props} sprite="sprResearcher" />
  ),
  objScience: (props) => <CharacterDrawer {...props} sprite="sprScienceboss" />,
  objCraig: (props) => <CharacterDrawer {...props} sprite="sprCraig" />,
  objCeleb: (props) => <CharacterDrawer {...props} sprite="sprCeleb" />,
  objCycle: (props) => <CharacterDrawer {...props} sprite="sprCycle" />,
  objValerie: (props) => <CharacterDrawer {...props} sprite="sprValerie" />,
  objPirate: (props) => <CharacterDrawer {...props} sprite="sprCaptain" />,
  objWarrior: (props) => <CharacterDrawer {...props} sprite="sprFighter" />,
  objStreamer: (props) => <CharacterDrawer {...props} sprite="sprStreamer" />,
  objHeadmaster: (props) => (
    <CharacterDrawer {...props} sprite="sprHeadmaster" />
  ),
  // Not Significant
  objJay: undefined,
  objCarlos: undefined,
  objJavier: undefined,
  objNatalia: undefined,
  objAutumn: undefined,
  objTrent: undefined,
  objBored1: undefined,
  objBored2: undefined,
  objBored3: undefined,
  objGfxtee: undefined,
  objHatlady: undefined,
  objHatguy: undefined,
  objSteven: undefined,
  objAnnabel: undefined,
  objJackie: undefined,
  objDaniel: undefined,
  objSimge: undefined,
  objBallman: undefined,
  objIcecream: undefined,
  objHiker: undefined,
  objLisa: undefined,
  objBrodie: undefined,
  objLena: undefined,
  objTianyi: undefined,
  objMiranda: undefined,
  objWeaver: undefined,
  objMerrick: undefined,
  objFarzaneh: undefined,
  objBouncer: undefined,
  objKisy: undefined,
  objOleh: undefined,
  objIsabelle: undefined,
  objLucille: undefined,
  objFabio: undefined,
  objGaia: undefined,
  objGenesa: undefined,
  objClemens: undefined,
  objNaveen: undefined,
  objRahma: undefined,
  objKaan: undefined,
  objAnton: undefined,
  objPaula: undefined,
  objTomislav: undefined,
  objMod: undefined,
  objOdina: undefined,
  objKarma: undefined,
  objVilma: undefined,
  objIzuchukwu: undefined,
  objCynthia: undefined,
  objBeatrice: undefined,
  objLillian: undefined,
  objLeagueman: undefined,
  objRaymond: undefined,
  objYamileidys: undefined,
  objBee: undefined,
  objHSmate: undefined,
  objHSgirl: undefined,
  objHShero: undefined,
  objMagdalena: undefined,
  objPreston: undefined,
  objHena: undefined,
  objIndie: undefined,
  objZara: undefined,
  objRuben: undefined,
  objYoandy: undefined,
  objKatya: undefined,
  objLogan: undefined,
  objVuk: undefined,
  objPirate_1: undefined,
  objPirate_2: undefined,
  objEtienne: undefined,
  objBoreal: undefined,
  objTrizah: undefined,
  objRufus: undefined,
  objWitchinstructor: undefined,
  objKids: undefined,
  objAthan: undefined,
  objJiyun: undefined,
  objRacer: undefined,
  objDiana: undefined,
  objJini: undefined,
  objJesse: undefined,
  objFanspike: undefined,
  objFanbro: undefined,
  objFankid: undefined,
  objRex: undefined,
  objMartin: undefined,

  objCameralook: undefined,
  objGift: undefined,
  objGymdoor: undefined,
  objRailhouse: undefined,
  objBallcenter: undefined,
  objBoathouse: undefined,
  objPier_land: undefined,
  objRailwall: undefined,
  objNode: undefined,
  objSit: undefined,
  objRoamerPOI: undefined,
  objGameplay: undefined,
  objAudioPlayer: undefined,
  objVending: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "vending_machine",
          x: props.object.x,
          y: props.object.y,
          z: props.object.z,
          z_angle: 90 + ((props.object.angle ?? 0) as number),
        }),
        [props.object],
      )}
      {...props}
    />
  ),
  objSpawner: undefined,
  objBallshrooms: undefined,
  objBossElevator: undefined,
  objBossroom: undefined,
  objLockerroom: undefined,
  objToilet: undefined,
  objIngredientCollect: undefined,
  objRailswitch: undefined,
  objClothesShop: undefined,
  objDiner: undefined,
  objInteractable: undefined,
  objCamp: undefined,
  objMolehill: undefined,
  objCity: undefined,
  objLeafs: undefined,
  objRope: undefined,
  objRubberplaque: undefined,
  objRubberfamrer: undefined,
  objEvolveshroom: undefined,
  objAcademymarker: undefined,
  objClub: undefined,
  objBeachedTurtle: undefined,
  objOcean: undefined,
  objPier_sea: undefined,
  objGameplay_turtle: undefined,
  objBalldispenser: undefined,
  objAcademygate: undefined,
  objAcademyroom: undefined,
  objBouncy: undefined,
  objRain: undefined,
  objUnderConstruction: undefined,
  objKorwin: undefined,
  objTrainboss: undefined,
  objLeagueTower: undefined,
  objMall: undefined,
  objFlycars: undefined,
  objTrashbin: undefined,
  objBooster: undefined,
  objAd: undefined,
  objZipstation: undefined,
  objStadiumMusic: undefined,
  objEvolvetrickies: undefined,
  objMangroveboss: undefined,
  objWindvolume: undefined,
  objDeathplane: undefined,
  objSecretYeti: undefined,
  objAcademyRoomModel: undefined,
  objSpinner: undefined,
  objHiddenObject: undefined,
  objSecretReserve: undefined,
  objApocalypse: undefined,
  objStadiumTrailer: undefined,
  objStadiumCredits: undefined,
  objShroomgod: undefined,
  objSunkenplaque: undefined,
  objSunkenboss: undefined,
  objSunkenlock: undefined,
  objConstructionguy: undefined,
  objReserveplaque: undefined,
  objTutorialtext: undefined,
  objThrowable_ball: undefined,
  objHometownBedroom: undefined,
  objWardrobe: undefined,
  objBedrest: undefined,
  objHomeotwnNorthGuard: undefined,
  objTutorial: undefined,
  objStarters: undefined,
  objTVprop: undefined,
  objNetroom: undefined,
  objTitle: undefined,
};

export default function ObjectDrawers({ levelData }: { levelData: LevelData }) {
  return levelData.objects_array?.map((object) => {
    const Component =
      OBJECT_DRAWER_MAP[object.object ?? "objNode"] ?? TextDrawer;
    const position: [number, number, number] = [
      -(object.x ?? 0),
      object.y ?? 0,
      findFloorPosition(object.x ?? 0, object.y ?? 0, levelData) +
        (object.z ?? 0),
    ];
    return (
      <Component
        key={`${object.obj_guid}${object.x}${object.y}${object.z}`}
        object={object}
        position={position}
        levelData={levelData}
      />
    );
  });
}
