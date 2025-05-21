import { useLocalStorage } from "usehooks-ts";
import SpoilerOptions from "./shared/SpoilerOptions";
import { Language } from "./shared/Language";
import { Outlet } from "react-router-dom";

export default function SpoilerWarning() {
  const [spoilersOk, setSpoilersOk] = useLocalStorage("spoilersOk2", false, {
    serializer: String,
    deserializer: (value) => value == "true",
  });
  const site = import.meta.env.VITE_BRANDING;

  return spoilersOk ||
    window.navigator.userAgent.toLowerCase().includes("prerender") ? (
    <Outlet />
  ) : (
    <div className="commoncontainer">
      <img src="/gameassets/sprExclam_1.png" />
      <h1>Notice!</h1>
      <p>
        {site} is an unofficial resource for Beastieball!
        <br />
        It may contain content that doesn't appear in the game, posting of this
        content in official Wishes Unlimited channels (e.g Wishes Unlimited
        Discord) is not allowed as per Wishes Unlimited's rules.
        <br />
        {site} will also contain spoilers for the full game, in order to avoid
        spoilers you can set to only show beasties/characters you've clicked on.
        All other beasties/characters will have images and names hidden until
        you click on them.
      </p>
      <SpoilerOptions />
      <br />
      <p>
        <button onClick={() => setSpoilersOk(true)}>Confirm</button>
      </p>
      <Language />
    </div>
  );
}
