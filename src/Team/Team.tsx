import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";
import OpenGraph from "../shared/OpenGraph";

export default function Team() {
  return (
    <NavigationMenu title="Teams">
      <OpenGraph
        title={`Teams - ${import.meta.env.VITE_BRANDING}`}
        image="gameassets/sprMainmenu/20.png"
        url="/team/"
        description="Team Viewer and Builder for Beastieball!"
      />
      <NavigationMenuOption
        text="Home"
        image="/gameassets/sprMainmenu/14.png"
        hoverImage="/gameassets/sprMainmenu/15.png"
        location="/"
      />
      <NavigationMenuOption
        text="Team Viewer"
        image="/gameassets/sprMainmenu/8.png"
        hoverImage="/gameassets/sprMainmenu/9.png"
        location="/team/viewer/"
      />
      <NavigationMenuOption
        text="Team Builder"
        image="/gameassets/sprMainmenu/18.png"
        hoverImage="/gameassets/sprMainmenu/19.png"
        location="/team/builder/"
      />
      {/* <NavigationMenuOption
        text="Encounters"
        image="/gameassets/sprMainmenu/27.png"
        hoverImage="/gameassets/sprMainmenu/28.png"
        location="/team/encounters/"
      /> */}
    </NavigationMenu>
  );
}
