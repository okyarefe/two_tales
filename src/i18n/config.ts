// Locale wiring for the app UI (Phase 1: locale comes from the user's
// native_language setting, not the URL). Add a locale here only once a
// matching messages/<code>.json file exists, so we never route users to a
// half-translated UI — unmapped languages fall back to English.

export const locales = ["en", "tr", "de", "es", "fr", "fi"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

// Cookie that carries the resolved locale between requests (fast read, no DB hit).
export const LOCALE_COOKIE = "NEXT_LOCALE";

// users.native_language stores full language names ("English", "Turkish").
// Only languages with a messages file are mapped; the rest resolve to English.
const LANGUAGE_TO_LOCALE: Record<string, AppLocale> = {
  English: "en",
  Turkish: "tr",
  German: "de",
  Spanish: "es",
  French: "fr",
  Finnish: "fi",
};

export function localeFromLanguage(
  language: string | null | undefined,
): AppLocale {
  if (!language) return defaultLocale;
  return LANGUAGE_TO_LOCALE[language] ?? defaultLocale;
}

// Reverse of LANGUAGE_TO_LOCALE: locale code -> the native_language name.
const LOCALE_TO_LANGUAGE = Object.fromEntries(
  Object.entries(LANGUAGE_TO_LOCALE).map(([language, locale]) => [
    locale,
    language,
  ]),
) as Record<AppLocale, string>;

export function languageFromLocale(locale: string | null | undefined): string {
  return isAppLocale(locale) ? LOCALE_TO_LANGUAGE[locale] : "English";
}

// Endonyms (each language's name in itself) for the language switcher UI.
export const LANGUAGE_ENDONYMS: Record<string, string> = {
  English: "English",
  Turkish: "Türkçe",
  German: "Deutsch",
  Spanish: "Español",
  French: "Français",
  Finnish: "Suomi",
};

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return !!value && (locales as readonly string[]).includes(value);
}
