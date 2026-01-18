import { useLocalStorage } from "usehooks-ts";
import { NavigationMenu, NavigationMenuOption } from "./shared/NavigationMenu";
import useLocalization from "./localization/useLocalization";

export default function Secrets() {
  const { L } = useLocalization();

  const [secrets, setSecrets] = useLocalStorage("secrets", false);
  return (
    <>
      <NavigationMenu
        title={L("secrets.title")}
        note={
          <>
            <div>{L("secrets.disclamer")}</div>
            <label style={{ marginBottom: "1em" }}>
              {L("secrets.label")}
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
              text={L("secrets.beastiepedia")}
              image="/gameassets/sprMainmenu/0.png"
              hoverImage="/gameassets/sprMainmenu/1.png"
              location="/beastiepedia/"
            />

            <NavigationMenuOption
              text={L("teams.encounters.title")}
              image="/gameassets/sprMainmenu/27.png"
              hoverImage="/gameassets/sprMainmenu/28.png"
              location="/team/encounters/"
            />
            <NavigationMenuOption
              text={L("secrets.map")}
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
