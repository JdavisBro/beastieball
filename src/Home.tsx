import Events from "./Events/Events";
import useLocalization from "./localization/useLocalization";
import { NavigationMenu, NavigationMenuOption } from "./shared/NavigationMenu";
import OpenGraph from "./shared/OpenGraph";

export default function Home(): React.ReactNode {
  const { L } = useLocalization();

  return (
    <NavigationMenu note={<Events />}>
      <OpenGraph
        title={import.meta.env.VITE_BRANDING}
        image="ball.png"
        url=""
        description={L("common.description")}
      />
      <NavigationMenuOption
        text={L("playdex.title")}
        image={"/gameassets/sprMainmenu/6.png"}
        hoverImage={"/gameassets/sprMainmenu/7.png"}
        location={"/playdex/"}
      />
      <NavigationMenuOption
        text={L("beastiepedia.title")}
        image={"/gameassets/sprMainmenu/0.png"}
        hoverImage={"/gameassets/sprMainmenu/1.png"}
        location={"/beastiepedia/"}
      />
      <NavigationMenuOption
        text={L("map.title")}
        image={"/gameassets/sprMainmenu/2.png"}
        hoverImage={"/gameassets/sprMainmenu/3.png"}
        location={"/map/"}
      />
      <NavigationMenuOption
        text={L("teams.title")}
        image={"/gameassets/sprMainmenu/20.png"}
        hoverImage={"/gameassets/sprMainmenu/21.png"}
        location={"/team/"}
      />
    </NavigationMenu>
  );
}
