import beastie_data from "./raw/beastie_data.json";

export type BeastieType = {
  ability: Array<string>;
  ability_hidden: boolean;
  allowedInPromo: boolean | number;
  animator: number | number[];
  attklist: Array<string>;
  attklist_randomize: number;
  ba: number;
  // body atk / pow
  bd: number;
  // body def
  ha: number;
  // spirit (heart?) atk / pow
  hd: number;
  // spirit def
  ma: number;
  // mind atk / pow
  md: number;
  // mind def

  // moved
  // ball_impact_pos: {
  //   x: number;
  //   y: number;
  // };
  // ball_miss_pos: {
  //   x: number;
  //   y: number;
  // };
  // ball_ready_pos: {
  //   x: number;
  //   y: number;
  // };
  base_exp: number;
  body_color_index: number;
  face_color_index: number;
  colormeta: null | number[];
  colors: Array<{
    array: Array<{
      color: number;
      x: number;
    }>;
  }>;
  colors2: null | Array<{
    array: Array<{
      color: number;
      x: number;
    }>;
  }>;
  // array of objects with array key to an array of objs
  shiny: Array<{
    array: Array<{
      color: number;
      x: number;
    }>;
  }>;
  combos: Array<Array<number>>;
  desc: string;
  designer: number | number[];
  evo_pose: Array<{
    anim: string;
    scale: number;
    x: number;
    y: number;
  }>;
  evolution:
    | null
    | {
        condition: number[];
        specie: string;
        value: number[];
      }[];
  family: string;
  first_frame: number;
  foot_size: number;
  foot_type: number;
  growth: number;
  hidden: boolean;
  hidden_counter: null | {
    event: null;
    freq: number;
    my_data: null;
    rel_color: number;
    type: number;
  };
  id: string;
  isBaby: boolean;
  learnset: number;
  learnset_randomize: number;
  linked_colors: object;
  loco: {
    anim_min_speed: number;
    char_width: number;
    emote_hop_height: number;
    float_dist: number;
    float_wave: number;
    float_wave_freq: number;
    hop_height: number;
    hop_length: number;
    hop_min_speed: number;
    hop_shake: number;
    hop_wobble: number;
    move_accel: number;
    move_decel: number;
    move_pause_frames: Array<number>;
    move_speed: number;
    move_speed_start: number;
    move_to_idle_transition_anim: string;
    move_to_idle_transition_frames: Array<number>;
    randomize_idle: boolean | number;
    squishiness: number;
    stretchiness: number;
  };
  name: string;
  number: number;
  palettes: number;
  // moved
  // partner_impact: {
  //   angle: number;
  //   anim: string;
  //   x: number;
  //   y: number;
  // };
  prev_ids: Array<string>;
  recruit: {
    conditions: Array<
      Partial<{
        effect_pow?: string;
        effect_type?: number | number[];
        event: null;
        freq: number;
        func?: null;
        my_data: null;
        player?: number;
        rel_color: number;
        damage?: string | number;
        target: number | Array<number>;
        type: number;
      }>
    >;
    description: string;
  };
  roamer_style: {
    _name: string;
    can_react: boolean;
    can_socialize: boolean;
    can_volley: boolean;
    cancel_on_player_invincible: boolean;
    checking_player_distance: boolean;
    colliding: boolean;
    default_locomote: boolean;
    default_physics: boolean;
    flying: boolean;
    interact_force: boolean;
    render_go_direction: boolean;
    render_guard_radius: boolean;
    seeking_interact: boolean;
  };
  rougelvl?: -1;
  scale: Array<number>;
  // moved
  // splash_pos: {
  //   angle: number;
  //   anim: string;
  //   x: number;
  //   y: number;
  // };
  spr: number;
  spr_alt: number[];
  tamecond: null;
  tamelvl: number;
  tyield: Array<string | number>;
};

const BEASTIE_DATA: Map<string, BeastieType> = new Map();

const sorted = Object.entries(beastie_data).sort(
  ([, a], [, b]) => a.number - b.number,
);

for (const [key, value] of sorted) {
  BEASTIE_DATA.set(key, value);
}

export default BEASTIE_DATA;
