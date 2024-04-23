import { useLocalStorage } from "usehooks-ts";

export default function SpoilerWarning(props: {
  children: React.ReactElement;
}) {
  const [spoilersOk, setSpoilersOk] = useLocalStorage("spoilersOk", false, {
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
        This website includes spoilers for Beastieball!! Proceed at your own
        risk!
      </p>
      <button onClick={() => setSpoilersOk(true)}>
        I'M OK WITH SPOILERS!!!
      </button>
    </div>
  );
}
