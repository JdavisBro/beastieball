type ClassMap<T> = {
  _: string;
  [key: string]: T | string;
};

type SaveBeastie = {
  _: string;
  pid: string;
};

type SaveStructures = {
  visited_levels: ClassMap<number>;
  beastie_bank: ClassMap<SaveBeastie>;
  player_pos: number[];
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
  zones_cleared: {
    _: string;
    [key: string]: number | string;
  };
  wordpacks_unlocked: {
    _: string;
    [key: string]: number | string;
  };
  clothes_unlocked: ClassMap<string>;
};

type SaveValues = {
  beastie_pid_starter_0: string;
  player_name: string;
};

type SaveData = SaveStructures & SaveValues;

export default SaveData;
