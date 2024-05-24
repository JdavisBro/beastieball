import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";

export default function Modding(): React.ReactElement {
  return (
    <NavigationMenu title="Beastieball Modding Tools">
      <NavigationMenuOption
        text={"Beastieball Info"}
        image={"/gameassets/sprMainmenu/14.png"}
        hoverImage={"/gameassets/sprMainmenu/15.png"}
        location={"/"}
      />
      <NavigationMenuOption
        text={"Save Viewer/Editor"}
        image={"/gameassets/sprMainmenu/10.png"}
        hoverImage={"/gameassets/sprMainmenu/11.png"}
        location={"/modding/save/"}
      />
    </NavigationMenu>
  );
}
