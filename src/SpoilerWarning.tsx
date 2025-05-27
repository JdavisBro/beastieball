import { useLocalStorage } from "usehooks-ts";
import SpoilerOptions from "./shared/SpoilerOptions";
import { Language } from "./shared/Language";
import { PropsWithChildren } from "react";
import useLocalization from "./localization/useLocalization";

export default function SpoilerWarning({ children }: PropsWithChildren) {
  const [spoilersOk, setSpoilersOk] = useLocalStorage("spoilersOk2", false, {
    serializer: String,
    deserializer: (value) => value == "true",
  });
  const { L } = useLocalization();

  const site = import.meta.env.VITE_BRANDING;

  return spoilersOk ||
    window.navigator.userAgent.toLowerCase().includes("prerender") ? (
    children
  ) : (
    <div className="commoncontainer">
      <img src="/gameassets/sprExclam_1.png" />
      <h1>{L("notice.title")}</h1>
      <p>
        {L("notice.unofficial", { branding: site })}
        <br />
        {L("notice.wishes", { branding: site })}
        <br />
        {L("notice.spoilers", { branding: site })}
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
