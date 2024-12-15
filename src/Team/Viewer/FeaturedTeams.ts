import { Team } from "../Types";
import BringTheHeat from "./FeaturedTeams/BringTheHeat";
import Community from "./FeaturedTeams/Community";
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
};

const categories: FeaturedCategory[] = [BringTheHeat, Community, Playtest];

export default categories;
