import { Link } from "react-router-dom";
import useLocalization, {
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "../localization/useLocalization";

export function Language() {
  const { L, currentLanguage, setLanguage } = useLocalization();

  return (
    <>
      <label>
        {L("common.languageLabel")}
        <select
          value={currentLanguage}
          onChange={(event) =>
            setLanguage(
              SUPPORTED_LANGUAGES.includes(
                event.target.value as SupportedLanguage,
              )
                ? (event.target.value as SupportedLanguage)
                : "en",
            )
          }
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_NAMES[lang]}
            </option>
          ))}
        </select>
      </label>
      {currentLanguage != "en" ? (
        <div
          style={{
            maxWidth: "220px",
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        >
          This language is not fully supported yet. If you know English and this
          language please reach out to help translate the site at{" "}
          <Link to={import.meta.env.VITE_ISSUES_URL}>GitHub issues</Link>.
        </div>
      ) : null}
    </>
  );
}
