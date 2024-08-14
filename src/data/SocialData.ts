import social_data from "./raw/social_data.json";

type SocialEvent = {
  cost: number;
  id: string;
  dest_level: string;
  dest_object: number;
  parent: string; // recursive struct!!!
  collides: number;
  alt_complete_flag: number | string; // -1 or datacheck(class_datacheck)
  rankup: number | boolean;
  invite_scene: string; // function!!!
  prereq: {
    type: number[];
    field: number | string; // 0 or datacheck(class_datacheck)
  };
};

type SocialFriend = {
  id: string;
  max_hearts: number;
  spr: number;
  object: number;
  loneliness: number;
  events: SocialEvent[];
  img: number;
  name: string;
  collision_scene: string; // function!!
  teach_scene: string; // function!!
  plays: string[];
  unavailable_func: string; // function!!
  same_screen_scene: string; // function!!
};

const SOCIAL_DATA: SocialFriend[] = social_data;

export default SOCIAL_DATA;
