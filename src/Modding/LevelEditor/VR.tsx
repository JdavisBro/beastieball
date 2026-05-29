import useLevelEditor from "./useLevelEditor";

import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Group, Raycaster, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import {
  createXRStore,
  useXRControllerLocomotion,
  XR,
  XROrigin,
} from "@react-three/xr";

const VR_WORLD_SCALE = 0.005; // ALSO CHANGE IN LevelEditor.tsx

function Locomotion() {
  const { levelData } = useLevelEditor();
  const player = levelData?.objects_array?.find(
    (object) => object.object == "objPlayer",
  );
  const playerPos: [number, number, number] = player
    ? [
        -(player.x ?? 0) * VR_WORLD_SCALE,
        1000,
        -(player.y ?? 0) * VR_WORLD_SCALE,
      ]
    : [0, 0, 0];
  const ref = useRef<Group>(null);
  useXRControllerLocomotion(ref);
  useFrame((root) => {
    if (!ref.current) return;
    const pos = ref.current.position;
    const raycast = new Raycaster(
      new Vector3(pos.x, pos.y + 5, pos.z),
      new Vector3(0, -1, 0),
    );
    const group = root.scene.children[0];
    const col = raycast.intersectObject(group)[0];
    if (!col) return;
    ref.current.position.setY(col.point.y);
  });
  return <XROrigin ref={ref} position={playerPos} />;
}

export function VRScene() {
  return <></>;
}

export function VRWrapper({ children }: PropsWithChildren) {
  const store = useMemo(
    () =>
      createXRStore({
        hand: { teleportPointer: true },
        controller: { teleportPointer: true },
      }),
    [],
  );

  useEffect(() => {
    store.enterVR();
  }, []);

  return (
    <XR store={store}>
      {children}
      <Locomotion />
    </XR>
  );
}
