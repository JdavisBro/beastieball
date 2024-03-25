import { useLocalStorage } from "usehooks-ts";

export default function SpoilerWarning(props: {
  children: React.ReactElement;
}) {
  const [spoilersOk, setSpoilersOk] = useLocalStorage("spoilersOk", false, {
    serializer: String,
    deserializer: (value) => value == "true",
  });

  return spoilersOk ? (
    props.children
  ) : (
    <div className="notfoundcontainer">
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
