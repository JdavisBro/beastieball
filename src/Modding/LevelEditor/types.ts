// MARK: Palette Reference

export type PaletteReference = {
  _: "class_palette_reference";
  dual?: boolean; // true
  base_index?: number; // 0
  texture_index?: number; // 1
  channel_index?: number; // 0
};

type PaletteArray = {
  _: "class_palette_array";
  array: PaletteReference[];
};

// MARK: Gizmos

/* prettier-ignore */
type CameraLook = {
  _: "class_cameralook";
  x?: number; y?: number; z?: number;
  look_x?: number; look_y?: number; look_z?: number;
  str?: number;
  width?: number; height?: number;
  thick?: number;
  fade?: number;
  priority?: number;
  axis_x?: number; axis_y?: number; axis_z?: number;
  model_collide?: boolean;
};

/* prettier-ignore */
type ColliderSound = {
  _: "class_collidersound";
  x?: number; y?: number; z?: number;
  width?: number; height?: number;
  model_collide?: boolean;
  sound?: string;
  directional?: number;
  moverepeat?: number;
}

type Gizmos = CameraLook | ColliderSound;

// MARK: Model

type ModelReference = {
  _: "class_model_reference";
  filename?: string;
};

type ModelReferenceArray = {
  _: "class_model_reference_array";
  array?: ModelReference;
  model_array?: Model[];
};
type ModelSpawn = {
  _: "class_model_spawn";
  colors?: PaletteArray;
  model?: ModelReference;
  weight?: number;
};

type ModelSpawnArray = {
  _: "class_model_spawn_array";
  array?: ModelSpawn;
  model?: ModelReference;
  seed?: number;
};

/* prettier-ignore */
export type Model = {
  _: "class_model";
  name?: string;
  model_filename?: string;
  has_switches?: boolean;
  switches?: ModelReferenceArray;
  has_spawns?: boolean;
  spawns?: ModelReferenceArray;
  x?: number; y?: number; z?: number;
  u_scale?: number;
  x_scale?: number; y_scale?: number; z_scale?: number;
  shadow_caster?: boolean;
  x_angle?: number; y_angle?: number; z_angle?: number;
  has_conditional?: boolean;
  conditional?: unknown; // DO LATER
  conditional_partial?: unknown; // DO LATER
  palettes?: PaletteArray;
  am_static?: boolean;
  effect_layer?: number;
  rustle?: boolean;
  near_clips?: boolean;
};

// MARK: Objects

/* prettier-ignore */
export type GameObject = {
  _: "class_object";
  name?: string;
  obj_guid?: string;
  object?: string;
  x?: number; y?: number; z?: number;
}

type ObjectReference = {
  _: "class_objectt_reference";
};

// MARK: Shapes

/* prettier-ignore */
type Ramp = {
  _: "class_ramp";
  x?: number; y?: number; z?: number;
  enabled?: boolean;
  z_change?: number;
  edge_low_a_x: number; edge_low_a_y: number;
  edge_low_b_x: number; edge_low_b_y: number;
  edge_high_a_x: number; edge_high_a_y: number;
  edge_high_b_x: number; edge_high_b_y: number;
  ramp_type: number;
  ramp_dist_min: number; ramp_dist_max: number;
  ramp_axis: number;
  ramp_proportion: number;
};

export type Shape = {
  _: "class_shape";
  x?: number;
  y?: number;
  z?: number;

  visible?: boolean;
  solid?: boolean;
  thickness?: number;
  water?: boolean;
  wall_collider: boolean;

  flat?: number;
  grass_model_array?: ModelSpawnArray;
  grass_cover_update_v1?: number;
  object?: ObjectReference;
  palette_reference?: PaletteReference;
  points_array?: number[];
  ramp?: Ramp;
  side_palette_reference?: PaletteReference;
};

export type ShapeGroup = {
  _: "class_shape_group";
  x?: number;
  y?: number;
  z?: number;
  water?: boolean;
  effect?: number;
  shapes_array?: Shape[];
};

// MARK: LevelData

export type LevelData = {
  _: "class_level";
  ambience?: string;
  background_prev_text_color?: number;
  cloud_color?: PaletteReference;
  display_name?: string;
  eff_bloom_threshold?: number;
  eff_chromatic_str?: number;
  floor_style?: number;
  gizmos_array?: Gizmos[];
  grass_color?: PaletteReference;
  grass_colors?: PaletteArray;
  grass_density?: number;
  grass_height?: number;
  grass_height_variance?: number;
  grass_thickness?: number;
  ground_cover_density?: number;
  ground_cover_models?: ModelSpawnArray;
  models_array?: Model[];
  music?: string;
  name?: string;
  objects_array?: GameObject[];
  palette_name?: string;
  palette_reference?: PaletteReference;
  rotate_tool_angle?: number;
  shadow_alpha?: number;
  shadow_coolor?: number;
  shape_groups_array: ShapeGroup[];
  sky_gradient?: PaletteReference;
  sunlight_elevation?: number;
  water_color?: PaletteReference;
};
