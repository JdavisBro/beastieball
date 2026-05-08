import { useRef } from "react";
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
import { DefaultMaterial } from "./MaterialShader";

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
        position[2] + (sprite_data.height / 4) * (scale ?? 1),
      ]}
      rotation={[Math.PI / 2, Math.PI, 0]}
      castShadow
      receiveShadow
    >
      <planeGeometry
        args={[
          (sprite_data.width / 2) * (scale ?? 1),
          (sprite_data.height / 2) * (scale ?? 1),
        ]}
      />
      <DefaultMaterial
        map={texture}
        side={DoubleSide}
        alphaTest={0.2}
        transparent
      />
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
        castShadow
        receiveShadow
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
  objRacer: (props) => <CharacterDrawer {...props} sprite="sprBarnes" />,
  // Not Significant
  objJay: (props) => <CharacterDrawer {...props} sprite="sprJay" />,
  objCarlos: (props) => <CharacterDrawer {...props} sprite="sprCarlos" />,
  objJavier: (props) => <CharacterDrawer {...props} sprite="sprJavier" />,
  objNatalia: (props) => <CharacterDrawer {...props} sprite="sprNatalia" />,
  objAutumn: (props) => <CharacterDrawer {...props} sprite="sprAutumn" />,
  objTrent: (props) => <CharacterDrawer {...props} sprite="sprTrent" />,
  objBored1: (props) => <CharacterDrawer {...props} sprite="sprBored1" />,
  objBored2: (props) => <CharacterDrawer {...props} sprite="sprBored2" />,
  objBored3: (props) => <CharacterDrawer {...props} sprite="sprBored3" />,
  objGfxtee: (props) => <CharacterDrawer {...props} sprite="sprGfxtee" />,
  objHatlady: (props) => <CharacterDrawer {...props} sprite="sprHatlady" />,
  objHatguy: (props) => <CharacterDrawer {...props} sprite="sprHatguy" />,
  objSteven: (props) => <CharacterDrawer {...props} sprite="sprSteven" />,
  objAnnabel: (props) => <CharacterDrawer {...props} sprite="sprAnnabel" />,
  objJackie: (props) => <CharacterDrawer {...props} sprite="sprJackie" />,
  objDaniel: (props) => <CharacterDrawer {...props} sprite="sprDaniel" />,
  objSimge: (props) => <CharacterDrawer {...props} sprite="sprNPC12" />,
  objBallman: (props) => <CharacterDrawer {...props} sprite="sprBallman" />,
  objIcecream: (props) => (
    <CharacterDrawer {...props} sprite="sprIcecreamguy" />
  ),
  objHiker: (props) => <CharacterDrawer {...props} sprite="sprJasperhiker" />,
  objLisa: (props) => <CharacterDrawer {...props} sprite="sprNPC06" />,
  objBrodie: (props) => <CharacterDrawer {...props} sprite="sprNPC40" />,
  objLena: (props) => <CharacterDrawer {...props} sprite="sprLena" />,
  objTianyi: (props) => <CharacterDrawer {...props} sprite="sprNPC31" />,
  objMiranda: (props) => <CharacterDrawer {...props} sprite="sprMiranda" />,
  objWeaver: (props) => <CharacterDrawer {...props} sprite="sprWeaver" />,
  objMerrick: (props) => <CharacterDrawer {...props} sprite="sprNPC19" />,
  objFarzaneh: (props) => <CharacterDrawer {...props} sprite="sprNPC18" />,
  objBouncer: (props) => <CharacterDrawer {...props} sprite="sprBouncer" />,
  objKisy: (props) => <CharacterDrawer {...props} sprite="sprNPC02" />,
  objOleh: (props) => <CharacterDrawer {...props} sprite="sprNPC11" />,
  objIsabelle: (props) => <CharacterDrawer {...props} sprite="sprNPC01" />,
  objLucille: (props) => <CharacterDrawer {...props} sprite="sprNPC22" />,
  objFabio: (props) => <CharacterDrawer {...props} sprite="sprNPCb02" />,
  objGaia: (props) => <CharacterDrawer {...props} sprite="sprNPCb01" />,
  objGenesa: (props) => <CharacterDrawer {...props} sprite="sprNPCb04" />,
  objClemens: (props) => <CharacterDrawer {...props} sprite="sprNPCb05" />,
  objNaveen: (props) => <CharacterDrawer {...props} sprite="sprNPC23" />,
  objRahma: (props) => <CharacterDrawer {...props} sprite="sprNPC27" />,
  objKaan: (props) => <CharacterDrawer {...props} sprite="sprNPC04" />,
  objAnton: (props) => <CharacterDrawer {...props} sprite="sprNPC05" />,
  objPaula: (props) => <CharacterDrawer {...props} sprite="sprNPC28" />,
  objTomislav: (props) => <CharacterDrawer {...props} sprite="sprNPC32" />,
  objMod: (props) => <CharacterDrawer {...props} sprite="sprNPC10" />,
  objOdina: (props) => <CharacterDrawer {...props} sprite="sprNPC26" />,
  objKarma: (props) => <CharacterDrawer {...props} sprite="sprKarma" />,
  objVilma: (props) => <CharacterDrawer {...props} sprite="sprNPC33" />,
  objIzuchukwu: (props) => <CharacterDrawer {...props} sprite="sprNPC30" />,
  objCynthia: (props) => <CharacterDrawer {...props} sprite="sprAndrea" />,
  objBeatrice: (props) => <CharacterDrawer {...props} sprite="sprBeatrice" />,
  objLillian: (props) => <CharacterDrawer {...props} sprite="sprLillian" />,
  objLeagueman: (props) => <CharacterDrawer {...props} sprite="sprLeagueman" />,
  objRaymond: (props) => <CharacterDrawer {...props} sprite="sprRaymond" />,
  objYamileidys: (props) => <CharacterDrawer {...props} sprite="sprNPC29" />,
  objBee: (props) => <CharacterDrawer {...props} sprite="sprBee" />,
  objHSmate: (props) => <CharacterDrawer {...props} sprite="sprHSmate" />,
  objHSgirl: (props) => <CharacterDrawer {...props} sprite="sprHSgal" />,
  objHShero: (props) => <CharacterDrawer {...props} sprite="sprHShero" />,
  objMagdalena: (props) => <CharacterDrawer {...props} sprite="sprNPC38" />,
  objPreston: (props) => <CharacterDrawer {...props} sprite="sprPreston" />,
  objHena: (props) => <CharacterDrawer {...props} sprite="sprNPC21" />,
  objIndie: (props) => <CharacterDrawer {...props} sprite="sprIndie" />,
  objZara: (props) => <CharacterDrawer {...props} sprite="sprNPC16" />,
  objRuben: (props) => <CharacterDrawer {...props} sprite="sprNPC17" />,
  objYoandy: (props) => <CharacterDrawer {...props} sprite="sprNPC14" />,
  objKatya: (props) => <CharacterDrawer {...props} sprite="sprNPC03" />,
  objLogan: (props) => <CharacterDrawer {...props} sprite="sprLogan" />,
  objVuk: (props) => <CharacterDrawer {...props} sprite="sprNPC20" />,
  objPirate_1: (props) => <CharacterDrawer {...props} sprite="sprPirate1" />,
  objPirate_2: (props) => <CharacterDrawer {...props} sprite="sprPirate2" />,
  objEtienne: (props) => <CharacterDrawer {...props} sprite="sprNPC25" />,
  objBoreal: (props) => <CharacterDrawer {...props} sprite="sprBoreal" />,
  objTrizah: (props) => <CharacterDrawer {...props} sprite="sprNPCb03" />,
  objRufus: (props) => <CharacterDrawer {...props} sprite="sprRufus" />,
  objWitchinstructor: (props) => (
    <CharacterDrawer {...props} sprite="sprInstructor" />
  ),
  objKids: (props) => <CharacterDrawer {...props} sprite="sprKids" />,
  objAthan: (props) => <CharacterDrawer {...props} sprite="sprNPC08" />,
  objJiyun: (props) => <CharacterDrawer {...props} sprite="sprNPC09" />,
  objDiana: (props) => <CharacterDrawer {...props} sprite="sprNPC24" />,
  objJini: (props) => <CharacterDrawer {...props} sprite="sprNPC39" />,
  objJesse: (props) => <CharacterDrawer {...props} sprite="sprJesse" />,
  objFanspike: (props) => <CharacterDrawer {...props} sprite="sprFanspike" />,
  objFanbro: (props) => <CharacterDrawer {...props} sprite="sprFanbro" />,
  objFankid: (props) => <CharacterDrawer {...props} sprite="sprFankid" />,
  objRex: (props) => <CharacterDrawer {...props} sprite="sprRex" />,
  objMartin: (props) => <CharacterDrawer {...props} sprite="sprMartin" />,
  objConstructionguy: (props) => (
    <CharacterDrawer {...props} sprite="sprConstructionguy" />
  ),
  objRubberfamrer: (props) => <CharacterDrawer {...props} sprite="sprNPC07" />,
  objUnderConstruction: (props) => (
    <CharacterDrawer {...props} sprite="sprNPCUC" />
  ),
  // MARK: Models
  objGift: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "gift",
      }}
      palettes={2}
      {...props}
    />
  ),
  objRailwall: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "traincross_down",
        z_angle: props.object.angle,
      }}
      palettes={1}
      {...props}
    />
  ),
  objVending: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "vending_machine",
        z_angle: 90 + ((props.object.angle ?? 0) as number),
      }}
      {...props}
    />
  ),
  objBallshrooms: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "shroom_cluster",
      }}
      {...props}
    />
  ),
  objRailswitch: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "rail_lever_up",
      }}
      palettes={1}
      {...props}
    />
  ),
  objCamp: (props) =>
    (props.object.model_keep ?? true) ? (
      <ModelDrawer
        model={{
          _: "class_model",
          model_filename: "reserve_camp_young",
        }}
        palettes={3}
        {...props}
      />
    ) : (
      <TextDrawer {...props} />
    ),
  objMolehill: (props) => (
    <ModelDrawer
      model={{
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
      }}
      {...props}
    />
  ),
  objRope: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "rope_down",
        x: props.object.x ?? 0,
        y: props.object.y ?? 0,
        z_angle: props.object.angle,
      }}
      palettes={2}
      {...props}
    />
  ),
  objBalldispenser: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "ball_dispenser_2",
      }}
      {...props}
    />
  ),
  objAcademygate: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "academy_gate",
        x: 1982.5,
        y: 1992,
      }}
      {...props}
    />
  ),
  objBouncy: (props) => (
    <ModelDrawer
      model={{
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
      }}
      {...props}
    />
  ),
  objTrashbin: (props) => {
    const { levelData } = useLevelEditor();
    return (
      <ModelDrawer
        model={{
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
        }}
        palettes={4}
        {...props}
      />
    );
  },
  objBooster: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "booster",
        z_angle: props.object.angle + 180,
      }}
      palettes={4}
      {...props}
    />
  ),
  objAd: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: "billboard",
        z:
          props.position[2] +
          (props.object.z ?? 0) +
          (props.object.z_up ?? 500),
        u_scale: props.object.scale,
        z_angle: props.object.angle,
      }}
      palettes={4}
      {...props}
    />
  ),
  objSpinner: (props) => (
    <ModelDrawer
      model={{
        _: "class_model",
        model_filename: !props.object.mode
          ? "spinner"
          : props.object.mode == 1
            ? "spinwall"
            : props.object.wall_platform
              ? "spinwall_tall_platform"
              : "spinwall_tall",
        z_angle: props.object.start_angle ?? 0,
      }}
      palettes={4}
      {...props}
    />
  ),
  // MARK: Sprites
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
  objThrowable_ball: (props) => (
    <CharacterDrawer
      sprite={"sprBall"}
      index={props.object.natural ? "2" : "0"}
      scale={1 / 3}
      {...props}
    />
  ),
  // MARK: Beasties
  objKorwin: undefined,
  objSecretYeti: undefined,
  objSecretReserve: undefined,
  objTrainboss: undefined,
  objSunkenboss: undefined,
  objMangroveboss: undefined,
  objShroomgod: undefined,
  // MARK: Position / Range
  objCameralook: undefined,
  objGymdoor: undefined,
  objRailhouse: undefined,
  objBallcenter: undefined,
  objBoathouse: undefined,
  objPier_land: undefined,
  objNode: undefined,
  objSit: undefined,
  objRoamerPOI: undefined,
  objGameplay: undefined,
  objAudioPlayer: undefined,
  objSpawner: undefined,
  objBossElevator: undefined,
  objBossroom: undefined,
  objLockerroom: undefined,
  objToilet: undefined,
  objIngredientCollect: undefined,
  objClothesShop: undefined,
  objDiner: undefined,
  objInteractable: undefined,
  objCity: undefined,
  objLeafs: undefined,
  objRubberplaque: undefined,
  objEvolveshroom: undefined,
  objAcademymarker: undefined,
  objClub: undefined,
  objOcean: undefined,
  objPier_sea: undefined,
  objGameplay_turtle: undefined,
  objAcademyroom: undefined,
  objRain: undefined,
  objLeagueTower: undefined,
  objMall: undefined,
  objFlycars: undefined,
  objZipstation: undefined,
  objStadiumMusic: undefined,
  objEvolvetrickies: undefined,
  objWindvolume: undefined,
  objDeathplane: undefined,
  objAcademyRoomModel: undefined,
  objHiddenObject: undefined,
  objApocalypse: undefined,
  objStadiumTrailer: undefined,
  objStadiumCredits: undefined,
  objSunkenplaque: undefined,
  objSunkenlock: undefined,
  objReserveplaque: undefined,
  objTutorialtext: undefined,
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
