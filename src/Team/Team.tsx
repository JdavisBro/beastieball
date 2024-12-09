import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";

export default function Team() {
  return (
    <NavigationMenu title="Teams">
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
    </NavigationMenu>
  );
}
