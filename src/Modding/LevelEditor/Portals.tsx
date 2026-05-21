import useLevelEditor from "./useLevelEditor";
import type { Portal } from "../../data/WorldData";
import { findFloorPosition } from "./LevelEditor";
import { Wireframe } from "@react-three/drei";

function Portal({ portal }: { portal: Portal }) {
  const { levelData } = useLevelEditor();

  const floor_z = findFloorPosition(portal.x ?? 0, portal.y ?? 0, levelData);

  const width = (portal.x2 ?? 0) - (portal.x1 ?? 0);
  const height = (portal.y2 ?? 0) - (portal.y1 ?? 0);
  const depth = (portal.z2 ?? 200) - (portal.z1 ?? 0);
  const center_x = (portal.x ?? 0) + (portal.x1 ?? 0) + width / 2;
  const center_y = (portal.y ?? 0) + (portal.y1 ?? 0) + height / 2;
  const center_z =
    floor_z + (portal.z_offset ?? 0) + (portal.z1 ?? 0) + depth / 2;
  return (
    <mesh
      position={[-center_x, center_y, center_z]}
      onClick={() =>
        console.log(portal, center_x, center_y, center_z, width, height, depth)
      }
    >
      <boxGeometry args={[width, height, depth]} />
      <Wireframe
        fillOpacity={0}
        fillMix={1}
        thickness={0.025}
        transparent
        backfaceStroke={"#ff0000"}
      />
    </mesh>
  );
}

export default function Portals() {
  const { levelStump } = useLevelEditor();

  return levelStump.portals_array.map((portal) => <Portal portal={portal} />);
}
