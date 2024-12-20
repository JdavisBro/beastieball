type ClassMap<T> = {
  _: string;
  [key: string]: T | string;
};

export type BeastieLogEvent = {
  _: string;
  args: Array<string | number>;
  date: number;
  event: number;
  level: number;
};

type BeastieStatistics = {
  aces: number;
  attacks: number;
  attacks_base: number;
  attacks_net: number;
  boosts_ba: number;
  boosts_ba_max: number;
  boosts_bd: number;
  boosts_bd_max: number;
  boosts_ha: number;
  boosts_ha_max: number;
  boosts_hd: number;
  boosts_hd_max: number;
  boosts_ma: number;
  boosts_ma_max: number;
  boosts_md: number;
  boosts_md_max: number;
  damage_avg: number;
  damage_healed_total: number;
  damage_highest: number;
  damage_highest_survived: number;
  damage_total: number;
  free_scores: number;
  moved: number;
  pass_received: number;
  pass_sent: number;
  plays_defense: number;
  plays_support: number;
  points_lost: number;
  points_played: number;
  points_present: number;
  points_won: number;
  received: number;
  received_damage_avg: number;
  received_damage_highest: number;
  received_damage_total: number;
  scores: number;
  serve_damage_avg: number;
  serve_damage_max: number;
  serve_damage_total: number;
  serves: number;
  shifted: number;
  status_0: number;
  status_1: number;
  status_2: number;
  status_3: number;
  status_4: number;
  status_5: number;
  status_6: number;
  status_7: number;
  status_8: number;
  status_9: number;
  status_10: number;
  status_11: number;
  status_12: number;
  tagged_in: number;
  tagged_out: number;
};

export type SaveBeastie = {
  _: string;
  ability: string;
  ability_index: number;
  attklist: string[];
  ba: number;
  ba_r: number;
  ba_t: number;
  bd: number;
  bd_r: number;
  bd_t: number;
  color: number[];
  current_status: number;
  date: number;
  event_log: {
    _: string;
    events: BeastieLogEvent[];
  };
  evolved: number;
  fiery: number;
  friends: []; // empty??
  ha: number;
  ha_r: number;
  ha_t: number;
  hd: number;
  hd_r: number;
  hd_t: number;
  hp: number;
  hpmax: number;
  injury: number;
  learnlist: string[];
  level: number;
  ma: number;
  ma_r: number;
  ma_t: number;
  md: number;
  md_r: number;
  md_t: number;
  name: string;
  number: string;
  origin: string;
  pid: string;
  scale: number;
  specie: string;
  spr_index: number;
  statistics: BeastieStatistics;
  trust: number;
  use_date: number;
  vibe: number;
  weariness: number;
  xp: number;
  yearning: string;
  yearning_move: string;
};

type OwnedItem = {
  _: string;
  date: number;
  id: string;
  num: number;
};

type PlayerTitle = {
  _: string;
  color: number;
  gender: number;
  wordA: string;
  wordB: string;
};

type PlayerOutfit = {
  _: string;
  clothes: string;
  collar: string;
  colorBodyA: number;
  colorBodyB: number;
  colorCollar: number;
  colorHair: number;
  colorHat: number;
  colorMask: number;
  colorNose: number;
  colorPants: number;
  colorPhone: number;
  colorShoes: number;
  colorSkin: number;
  gender: number;
  haircut: string;
  hat: string;
  mask: string;
  name: null | string;
  nose: string;
  pants: number;
  shoes: string;
  size_head: number;
  size_height: number;
  size_width: number;
};

type BeastieRelationship = {
  _: string;
  attacksA: number;
  attacksB: number;
  date: number;
  friendly: number;
  hot: number;
  immature: number;
  meter: number;
  past_type: number;
  pidA: string;
  pidB: string;
  pow: number;
  prev_pow: number;
  storyline: string;
  storyline_progress: number;
  storyline_side: number;
  storyline_watching: string;
  was_close: number;
};

type SpawnerSaveState = {
  _: string;
  data: Array<Array<number>>;
  level: string;
};

type SaveStructures = {
  away_games?: {
    _: string;
    team: string[];
    away: number;
    opponent: PlayerTitle;
  };
  away_team: string;
  away_team_requested_last: number;
  away_teams_seen: {
    _: string;
    uid: string;
    encounter: string;
    team: SaveBeastie[];
    title: PlayerTitle;
  }[];
  beastie_bank: ClassMap<SaveBeastie>;
  beastie_last_seen: string[];
  beastie_research: ClassMap<number>;
  clothes_unlocked: ClassMap<number>;
  gifts_found: ClassMap<number>;
  inventory: ClassMap<OwnedItem>;
  item_desc: ClassMap<null>;
  LOCAL_SETTINGS: {
    automode_start: number;
    menucolor: number;
    difficulty: number;
    autosave: number;
    screenshake: number;
    rumble: number;
    text_anim: number;
    combos: number;
    text_speed: number;
    timer: number;
    randomizer: number;
    intro_skip: number;
    ironman: number;
    autowin: number;
    flashes: number;
    sportspeed: number;
    cameramotion: number;
    randomizer_seed: number;
  };
  player_outfit: PlayerOutfit;
  player_pos: number[];
  player_title: PlayerTitle;
  relationships: {
    _: string;
    [key: string]: string | BeastieRelationship;
  };
  spawner_state: SpawnerSaveState;
  team_party: SaveBeastie[];
  team_redd: string[];
  team_registry: ClassMap<SaveBeastie>;
  temp: number[];
  visited_levels: ClassMap<number>;
  wordpacks_unlocked: ClassMap<number>;
  zones_cleared: {
    _: string;
    [key: string]: number | string;
  };
};

type SaveValues = {
  "": null;
  _: string;
  act0_1_riley_intro: number;
  act0_3_redd_intro: number;
  act0_4_beastie_guard: number;
  act0_4_beastie_watchers: number;
  act0_4_riley_interact_court: number;
  act0_5_guard_return: number;
  act0_7_redd_intro: number;
  act0_7_riley_preboss: number;
  act0_8_redd_boss: number;
  act0_bedroom: number;
  act0_random_encounter_explain: number;
  beastie_pid_hometown_north_0: string;
  beastie_pid_redd_trailer_0: string;
  beastie_pid_redd_trailer_1: string;
  beastie_pid_redd_trailer_2: string;
  beastie_pid_starter_1: string;
  beastie_pid_starter_2: string;
  bosses_revealed: number;
  defeated_redd: number;
  demo: number;
  demo_area_block: number;
  gender: number;
  in_tutorial: number;
  money: number;
  pids_assigned: number;
  player_color: number;
  player_level: string;
  player_map_x: number;
  player_map_y: number;
  player_name: string;
  playtime: number;
  railhouse_travel_info: number;
  ranked_wins: number;
  redd_post_boss_interact: number;
  reserve_radio: number;
  speedrun_time: number;
  sponsor_hometown: number;
  start_date: number;
  starter_choice: number;
  story_ranking: number;
  times_played_redd: number;
  TOTAL_TURNS_TAKEN: number;
  tutorial_actions: number;
  tutorial_defeat_progress: number;
  tutorial_progress: number;
  tutorial_reserves: number;
  unlocked_jump: number;
};

type SaveData = { [key: string]: number | string } & SaveStructures &
  SaveValues;

export default SaveData;
