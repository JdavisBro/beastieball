import { NavigationMenu, NavigationMenuOption } from "../shared/NavigationMenu";
import OpenGraph from "../shared/OpenGraph";

export default function Modding(): React.ReactElement {
  return (
    <>
      <OpenGraph
        title="Beastieball Modding Tools"
        image="gameassets/sprMainmenu/12.png"
        url="modding/"
        description="Modding Tools, like a save file viewer, for Humanball"
      />
      <NavigationMenu
        title="Beastieball Modding Tools"
        note={
          <h3>
            Warning! Modding could mess up your save file! Please make backups
            and be careful!
          </h3>
        }
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
