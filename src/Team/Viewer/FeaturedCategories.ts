import { Team } from "../Types";
import Community from "./FeaturedTeams/Community";
import HeatWave from "./FeaturedTeams/HeatWave";
import StarterBash from "./FeaturedTeams/StarterBash";
import BringTheHeat from "./FeaturedTeams/BringTheHeat";
import Playtest from "./FeaturedTeams/Playtest";

export type FeaturedTeamType = {
  team: Team;
  name: string;
  description: string;
  author: string;
  builder?: boolean;
};

export type FeaturedCategory = {
  header: string;
  description?: string;
  teams: FeaturedTeamType[];
  categories?: undefined;
};

export type FeaturedCategoryCollection = {
  header: string;
  description?: string;
  categories: FeaturedCategory[];
  teams?: undefined;
};

export type FeaturedCategoryRoot =
  | FeaturedCategoryCollection
  | FeaturedCategory;

const categories: FeaturedCategoryRoot[] = [
  Community,
  HeatWave,
  StarterBash,
  BringTheHeat,
  Playtest,
];

export default categories;
