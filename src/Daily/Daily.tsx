import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";

export default function Daily() {
  return (
    <NavigationMenu title="Dailies">
      <NavigationMenuOption
        text="Beastdle"
        image="/gameassets/sprMainmenu/25.png"
        hoverImage="/gameassets/sprMainmenu/25.png"
        location="/daily/beastdle"
      />
      <NavigationMenuOption
        text="Blurry"
        image="/gameassets/sprMainmenu/29.png"
        hoverImage="/gameassets/sprMainmenu/30.png"
        location="/daily/blurry"
      />
    </NavigationMenu>
  );
}
