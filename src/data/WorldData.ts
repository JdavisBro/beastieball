import world from "./world_data/world.json";

export type MapIcon = {
  _: string;
  cave_loc_a?: string;
  cave_loc_b?: string;
  conditional?: {
    _: string;
    key: string;
    value: number;
  };
  from_level: string;
  from_object?: string;
  from_object_guid?: string;
  has_conditional?: number;
  img?: number;
  is_cave?: number;
  object_y?: number;
  revealed_text?: string;
  sprite?: number;
  superheader?: number;
  text?: string;
  transit?: number;
  world_x: number;
  world_y: number;
  x: number;
  y: number;
  zoom_view?: number;
};

export type Portal = {
  _: string;
  destination?: string;
  direction?: number;
  door?: number;
  x: number;
  x1: number;
  x2: number;
  y: number;
  y1: number;
  y2: number;
  z1?: number;
};

export type LevelStump = {
  _: string;
  color?: number;
  display_name?: string;
  encounters: string[];
  has_spawns?: number | boolean;
  icons_array: MapIcon[];
  is_indoor?: number;
  name: string;
  portals_array: Portal[];
  spawn_name: string[];
  world_layer?: number;
  world_x1: number;
  world_x2: number;
  world_y1: number;
  world_y2: number;
};

export type World = {
  _: string;
  icons_array: MapIcon[];
  level_quadtree_size: number;
  level_stumps_array: LevelStump[];
  map_position_data: {
    _: string;
    [key: string]: { x: number; y: number } | string;
  };
  model_data: {
    _: string;
  };
};

const WORLD_DATA: World = world;

export default WORLD_DATA;
