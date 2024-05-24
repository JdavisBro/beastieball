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
        text={"The Game"}
        image={"/gameassets/sprMainmenu/6.png"}
        hoverImage={"/gameassets/sprMainmenu/7.png"}
        location={"https://beastieballgame.com"}
        target="_blank"
      />
      <NavigationMenuOption
        text={"Map"}
        image={"/gameassets/sprMainmenu/2.png"}
        hoverImage={"/gameassets/sprMainmenu/3.png"}
        location={"/map/"}
      />
    </NavigationMenu>
  );
}
