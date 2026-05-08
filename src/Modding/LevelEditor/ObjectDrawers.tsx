import { useMemo, useRef } from "react";
import { DoubleSide, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import type { GameObject, GameObjectTypes, Model } from "./types";
import styles from "./LevelEditor.module.css";
import { findFloorPosition } from "./LevelEditor";
import { ModelElem } from "./Models";
import setTextureDefaults from "./defaults";
import SPRITE_INFO_FULL from "../../data/raw/sprite_info_full.json";
import { Sprite } from "../../data/SpriteInfo";
import useLevelEditor from "./useLevelEditor";

type DrawerProps = {
  object: GameObject;
  position: [number, number, number];
};

function CharacterDrawer({
  position,
  sprite,
  index,
  path,
  scale,
}: {
  sprite: string;
  index?: string;
  path?: string;
  scale?: number;
} & DrawerProps) {
  const texture = useLoader(
    TextureLoader,
    path ??
      `${import.meta.env.VITE_DATA_URL}sprites/${sprite}/${index ?? 0}.png`,
  );
  setTextureDefaults(texture);

  const sprite_data = SPRITE_INFO_FULL[
    sprite as keyof typeof SPRITE_INFO_FULL
  ] as Sprite;

  return (
    <mesh
      position={[
        position[0],
        position[1],
        position[2] + (sprite_data.height / 4) * (scale ?? 0),
      ]}
      rotation={[Math.PI / 2, Math.PI, 0]}
    >
      <planeGeometry
        args={[
          (sprite_data.width / 2) * (scale ?? 0),
          (sprite_data.height / 2) * (scale ?? 0),
        ]}
      />
      <meshBasicMaterial map={texture} side={DoubleSide} transparent />
    </mesh>
  );
}

function ModelDrawer({
  object,
  model,
  palettes,
  position,
}: { model: Model; palettes?: number } & DrawerProps) {
  model.x = model.x ?? -position[0];
  model.y = model.y ?? position[1];
  model.z = model.z ?? position[2];
  if (palettes) {
    model.palettes = {
      _: "class_palette_array",
      array: [...new Array(palettes)].map(
        (_, index) => object["palette_" + (index + 1)],
      ),
    };
  }
  return <ModelElem model={model} useFloorPos={false} />;
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
  objConstructionguy: undefined,
  objRubberfamrer: undefined,
  objUnderConstruction: undefined,

  objCameralook: undefined,
  objGift: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "gift",
        }),
        [],
      )}
      palettes={2}
      {...props}
    />
  ),
  objGymdoor: undefined,
  objRailhouse: undefined,
  objBallcenter: undefined,
  objBoathouse: undefined,
  objPier_land: undefined,
  objRailwall: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "traincross_down",
          z_angle: props.object.angle,
        }),
        [props.object],
      )}
      palettes={1}
      {...props}
    />
  ),
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
          z_angle: 90 + ((props.object.angle ?? 0) as number),
        }),
        [props.object],
      )}
      {...props}
    />
  ),
  objSpawner: undefined,
  objBallshrooms: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "shroom_cluster",
        }),
        [],
      )}
      {...props}
    />
  ),
  objBossElevator: undefined,
  objBossroom: undefined,
  objLockerroom: undefined,
  objToilet: undefined,
  objIngredientCollect: undefined,
  objRailswitch: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "rail_lever_up",
        }),
        [],
      )}
      palettes={1}
      {...props}
    />
  ),
  objClothesShop: undefined,
  objDiner: undefined,
  objInteractable: undefined,
  objCamp: (props) =>
    (props.object.model_keep ?? true) ? (
      <ModelDrawer
        model={useMemo(
          () => ({
            _: "class_model",
            model_filename: "reserve_camp_young",
          }),
          [props.object],
        )}
        palettes={3}
        {...props}
      />
    ) : (
      <TextDrawer {...props} />
    ),
  objMolehill: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "molehill",
          palettes: {
            _: "class_palette_array",
            array: [
              {
                _: "class_palette_reference",
                base_index: 0,
                channel_index: 1,
                texture_index: 1,
              },
            ],
          },
        }),
        [props.object],
      )}
      {...props}
    />
  ),
  objCity: undefined,
  objLeafs: undefined,
  objRope: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "rope_down",
          x: props.object.x ?? 0,
          y: props.object.y ?? 0,
          z_angle: props.object.angle,
        }),
        [props.object],
      )}
      palettes={2}
      {...props}
    />
  ),
  objRubberplaque: undefined,
  objEvolveshroom: undefined,
  objAcademymarker: undefined,
  objClub: undefined,
  objBeachedTurtle: (props) =>
    [...new Array(8)].map((_, index) => (
      <CharacterDrawer
        key={index}
        sprite="sprGiantTurtleHead"
        index={String(index)}
        {...props}
        position={[
          props.position[0],
          props.position[1] - 20 - index * 10,
          props.position[2],
        ]}
        scale={2}
      />
    )),
  objOcean: undefined,
  objPier_sea: undefined,
  objGameplay_turtle: undefined,
  objBalldispenser: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "ball_dispenser_2",
        }),
        [props.object],
      )}
      {...props}
    />
  ),
  objAcademygate: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "academy_gate",
          x: 1982.5,
          y: 1992,
        }),
        [props.object],
      )}
      {...props}
    />
  ),
  objAcademyroom: undefined,
  objBouncy: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "bouncy",
          z: props.object.wall
            ? props.position[2] + (props.object.z_up ?? 100)
            : undefined,
          y_angle: props.object.wall ? -90 : 0,
          z_angle: props.object.wall ? props.object.angle : 0,
          palettes: {
            _: "class_palette_array",
            array: [
              props.object.palette_3,
              props.object.palette_2,
              props.object.palette_1,
            ],
          },
        }),
        [props.object],
      )}
      {...props}
    />
  ),
  objRain: undefined,
  objKorwin: undefined,
  objTrainboss: undefined,
  objLeagueTower: undefined,
  objMall: undefined,
  objFlycars: undefined,
  objTrashbin: (props) => {
    const { levelData } = useLevelEditor();
    return (
      <ModelDrawer
        model={useMemo(
          () => ({
            _: "class_model",
            model_filename: levelData.name?.includes("park")
              ? "city_trashcan_b"
              : "city_trashcan_a",
            z_angle: props.object.angle,
            palettes: {
              _: "class_palette_array",
              array: [
                {
                  _: "class_palette_reference",
                  base_index: 4,
                  channel_index: 4,
                },
              ],
            },
          }),
          [props.object],
        )}
        palettes={4}
        {...props}
      />
    );
  },
  objBooster: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "booster",
          z_angle: props.object.angle + 180,
        }),
        [props.object],
      )}
      palettes={4}
      {...props}
    />
  ),
  objAd: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: "billboard",
          z:
            props.position[2] +
            (props.object.z ?? 0) +
            (props.object.z_up ?? 500),
          u_scale: props.object.scale,
          z_angle: props.object.angle,
        }),
        [props.object],
      )}
      palettes={4}
      {...props}
    />
  ),
  objZipstation: undefined,
  objStadiumMusic: undefined,
  objEvolvetrickies: undefined,
  objMangroveboss: undefined,
  objWindvolume: undefined,
  objDeathplane: undefined,
  objSecretYeti: undefined,
  objAcademyRoomModel: undefined,
  objSpinner: (props) => (
    <ModelDrawer
      model={useMemo(
        () => ({
          _: "class_model",
          model_filename: !props.object.mode
            ? "spinner"
            : props.object.mode == 1
              ? "spinwall"
              : props.object.wall_platform
                ? "spinwall_tall_platform"
                : "spinwall_tall",
          z_angle: props.object.start_angle ?? 0,
        }),
        [props.object],
      )}
      palettes={4}
      {...props}
    />
  ),
  objHiddenObject: undefined,
  objSecretReserve: undefined,
  objApocalypse: undefined,
  objStadiumTrailer: undefined,
  objStadiumCredits: undefined,
  objShroomgod: undefined,
  objSunkenplaque: undefined,
  objSunkenboss: undefined,
  objSunkenlock: undefined,
  objReserveplaque: undefined,
  objTutorialtext: undefined,
  objThrowable_ball: (props) => (
    <CharacterDrawer
      sprite={"sprBall"}
      index={props.object.natural ? "2" : "0"}
      scale={1 / 3}
      {...props}
    />
  ),
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

export default function ObjectDrawers() {
  const { levelData } = useLevelEditor();
  return levelData.objects_array?.map((object, index) => {
    const Component =
      OBJECT_DRAWER_MAP[object.object ?? "objNode"] ?? TextDrawer;
    const position: [number, number, number] = [
      -(object.x ?? 0),
      object.y ?? 0,
      findFloorPosition(object.x ?? 0, object.y ?? 0, levelData) +
        (object.z ?? 0),
    ];
    return <Component key={index} object={object} position={position} />;
  });
}
