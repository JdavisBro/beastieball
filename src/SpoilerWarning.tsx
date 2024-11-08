import { useLocalStorage } from "usehooks-ts";
import SpoilerOptions from "./shared/SpoilerOptions";

export default function SpoilerWarning(props: {
  children: React.ReactElement;
}) {
  const [spoilersOk, setSpoilersOk] = useLocalStorage("spoilersOk2", false, {
    serializer: String,
    deserializer: (value) => value == "true",
  });

  return spoilersOk ||
    window.navigator.userAgent.toLowerCase().includes("prerender") ? (
    props.children
  ) : (
    <div className="commoncontainer">
      <img src="/gameassets/sprExclam_1.png" />
      <h1>Beastieball Spoiler Warning!!</h1>
      <p>
        This website includes spoilers for the full game of Beastieball!!
        <br />
        In order to avoid spoilers you can set {
          import.meta.env.VITE_BRANDING
        }{" "}
        to only show beasties you've clicked on.
        <br />
        All other beasties will have images and names hidden until you click on
        them.
      </p>
      <SpoilerOptions />
      <br />
      <p>
        <button onClick={() => setSpoilersOk(true)}>Confirm</button>
      </p>
    </div>
  );
}
