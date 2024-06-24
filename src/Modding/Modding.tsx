import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";
import OpenGraph from "../shared/OpenGraph";

export default function Modding(): React.ReactElement {
  return (
    <>
      <OpenGraph
        title="Beastieball Modding Tools"
        image="gameassets/sprMainmenu/12.png"
        url="modding/"
        description="Modding Tools, like a save file viewer, for Beastieball"
      />
      <NavigationMenu
        title="Beastieball Modding Tools"
        note="Warning! Modding could mess up your save file! Please make backups and be careful!"
      >
        <NavigationMenuOption
          text={"Save Viewer/Editor"}
          image={"/gameassets/sprMainmenu/10.png"}
          hoverImage={"/gameassets/sprMainmenu/11.png"}
          location={"/modding/save/"}
        />
      </NavigationMenu>
    </>
  );
}
