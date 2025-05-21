import useLocalization, {
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "../localization/useLocalization";

export function Language() {
  const { currentLanguage, setLanguage } = useLocalization();

  return (
    <label>
      Language:{" "}
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
  );
}
