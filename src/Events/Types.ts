export enum NoData {
  WaitingForResponse,
  NoData,
}

export type BallEvent = {
  key: string;
  url: string;
  img_url: string;
  has_results: boolean;
  times: string[][];
  rules: {
    experience: boolean;
    can_autowin: boolean;
    can_recruit: boolean;
    manual_points_to_win: number;
    set_level: number;
    combos: boolean;
    can_undo: boolean;
    timelimit_length: number;
    hidden_information: boolean;
    first_serve: number;
    specie_clause: boolean;
  };
  guilds: string[];
  bans: string[];
  active: boolean;
};

export type EventResponse = { currentEvent: BallEvent };

export type CarouselData = {
  data: {
    url: string;
    img: string;
    text: string[];
    langs: string[];
  }[];
};
