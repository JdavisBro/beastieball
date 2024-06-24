import { NavigationMenu, NavigationMenuOption } from "./shared/NavigationMenu";

export default function Home(): React.ReactNode {
  return (
    <NavigationMenu>
      <NavigationMenuOption
        text={"Beastiepedia"}
        image={"/gameassets/sprMainmenu/0.png"}
        hoverImage={"/gameassets/sprMainmenu/1.png"}
        location={"/beastiepedia/"}
      />
      <NavigationMenuOption
        text={"Map"}
        image={"/gameassets/sprMainmenu/2.png"}
        hoverImage={"/gameassets/sprMainmenu/3.png"}
        location={"/map/"}
      />
      {/* <NavigationMenuOption
        text={"Modding"}
        image={"/gameassets/sprMainmenu/12.png"}
        hoverImage={"/gameassets/sprMainmenu/13.png"}
        location={"/modding/"}
      /> */}
    </NavigationMenu>
  );
}
