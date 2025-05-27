import useLocalization from "../localization/useLocalization";
import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";
import OpenGraph from "../shared/OpenGraph";

export default function Team() {
  const { L } = useLocalization();

  return (
    <NavigationMenu title="Teams">
      <OpenGraph
        title={L("common.title", {
          page: L("teams.title"),
          branding: import.meta.env.VITE_BRANDING,
        })}
        image="gameassets/sprMainmenu/20.png"
        url="/team/"
        description={L("teams.description")}
      />
      <NavigationMenuOption
        text={L("teams.home")}
        image="/gameassets/sprMainmenu/14.png"
        hoverImage="/gameassets/sprMainmenu/15.png"
        location="/"
      />
      <NavigationMenuOption
        text={L("teams.viewer.title")}
        image="/gameassets/sprMainmenu/8.png"
        hoverImage="/gameassets/sprMainmenu/9.png"
        location="/team/viewer/"
      />
      <NavigationMenuOption
        text={L("teams.builder.title")}
        image="/gameassets/sprMainmenu/18.png"
        hoverImage="/gameassets/sprMainmenu/19.png"
        location="/team/builder/"
      />
    </NavigationMenu>
  );
}
