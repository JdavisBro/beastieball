export type BeastieType = {
  ability: Array<string>;
  ability_hidden: boolean;
  allowedInPromo: boolean;
  animator: number;
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
  colormeta: null;
  colors: Array<{
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
  evolution: null | string;
  // i assume it'll be the evo's id in the future but for now they're all null
  first_frame: number;
  foot_size: number;
  foot_type: number;
  growth: number;
  hidden: boolean;
  id: string;
  isBaby: boolean;
  learnset: number;
  learnset_randomize: number;
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
    move_min_dist: number;
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
        effect_pow: string;
        effect_type: number;
        event: null;
        freq: number;
        func: null;
        my_data: null;
        player: number;
        rel_color: number;
        damage: string;
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
    flying: boolean;
    interact_force: boolean;
    render_go_direction: boolean;
    render_guard_radius: boolean;
    seeking_interact: boolean;
  };
  scale: Array<number>;
  // moved
  // splash_pos: {
  //   angle: number;
  //   anim: string;
  //   x: number;
  //   y: number;
  // };
  spr: number;
  tamecond: null;
  tamelvl: number;
  tyield: Array<string | number>;
};
