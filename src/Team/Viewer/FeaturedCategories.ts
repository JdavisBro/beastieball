import { Team } from "../Types";
import BringTheHeat from "./FeaturedTeams/BringTheHeat";
import Community from "./FeaturedTeams/Community";
import Playtest from "./FeaturedTeams/Playtest";
import StarterBash from "./FeaturedTeams/StarterBash";

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
  StarterBash,
  BringTheHeat,
  Community,
  Playtest,
];

export default categories;
