import { useLocalStorage } from "usehooks-ts";
import { NavigationMenu, NavigationMenuOption } from "./shared/NavigationMenu";

export default function Secrets() {
  const [secrets, setSecrets] = useLocalStorage("secrets", false);
  return (
    <>
      <NavigationMenu
        title="Secrets"
        note={
          <>
            <div>
              Secrets enables viewing of information that is unused and may
              appear in the game in future, any of this information should not
              be talked about in official Wishes Unlimited channels.
            </div>
            <label style={{ marginBottom: "1em" }}>
              Secrets:{" "}
              <input
                type="checkbox"
                checked={secrets}
                onChange={() => setSecrets(!secrets)}
              />
            </label>
          </>
        }
      >
        {secrets ? (
          <>
            <NavigationMenuOption
              text={"Beastiepedia\nUnused Animations"}
              image="/gameassets/sprMainmenu/0.png"
              hoverImage="/gameassets/sprMainmenu/1.png"
              location="/beastiepedia/"
            />

            <NavigationMenuOption
              text="Encounters"
              image="/gameassets/sprMainmenu/27.png"
              hoverImage="/gameassets/sprMainmenu/28.png"
              location="/team/encounters/"
            />
            <NavigationMenuOption
              text={"Map\nEncounter Locations"}
              image="/gameassets/sprMainmenu/2.png"
              hoverImage="/gameassets/sprMainmenu/3.png"
              location="/map/"
            />
            <NavigationMenuOption
              text="Modding"
              image="/gameassets/sprMainmenu/12.png"
              hoverImage="/gameassets/sprMainmenu/13.png"
              location="/modding/"
            />
          </>
        ) : (
          <></>
        )}
      </NavigationMenu>
    </>
  );
}
