import useLocalization from "../localization/useLocalization";
import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";
import OpenGraph from "../shared/OpenGraph";

export default function Daily() {
  const { L } = useLocalization();
  return (
    <NavigationMenu title="Dailies">
      <OpenGraph
        title={L("common.title", {
          page: "Daily",
          branding: import.meta.env.VITE_BRANDING,
        })}
        image={"gameassets/sprMainmenu/25.png"}
        url={"daily/"}
        description={"Daily games for Beastieball"}
      />
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
