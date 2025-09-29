import social_data from "./raw/social_data.json";

type DataCheck = {
  comparison: number;
  editor_openable: boolean;
  key: string;
  lastcheck: null | number;
  name: string;
  needscheck: boolean;
  value: number;
};

type SocialEvent = {
  cost: number;
  id: string | { field: number; type: number[] };
  dest_level: string;
  dest_object: number | string;
  parent: string | null; // recursive struct!!!
  collides: boolean;
  alt_complete_flag: number | DataCheck | DataCheck[]; // -1 or datacheck(class_datacheck)
  rankup: boolean;
  prereq: {
    type: number[];
    field: string | number | DataCheck;
  };
};

type SocialFriend = {
  events: SocialEvent[];
  id: string;
  img: number;
  loneliness: number;
  max_hearts: number;
  name: string;
  object: string;
  plays: string[];
  spr: string;
};

const SOCIAL_DATA: SocialFriend[] = social_data;

export default SOCIAL_DATA;
