import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { locales, defaultLocale, localeFromLanguage, isAppLocale } from "../config";

// These tests guard the whole translation system against the most common
// i18n bug: a key added to one locale but forgotten in another (which throws a
// runtime "missing message" error in production). They read the real message
// files, so they fail the moment en.json and a translation drift apart.

const MESSAGES_DIR = path.resolve(process.cwd(), "messages");

type Json = { [key: string]: string | Json };

function loadMessages(locale: string): Json {
  const file = path.join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** Flatten nested message objects into dot-paths: { a: { b: "x" } } -> ["a.b"]. */
function keyPaths(obj: Json, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null
      ? keyPaths(v, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

/** Look up a dot-path value in a nested object. */
function valueAt(obj: Json, dotPath: string): string {
  return dotPath.split(".").reduce<unknown>(
    (acc, part) => (acc as Json)?.[part],
    obj,
  ) as string;
}

/** Extract ICU placeholder names, e.g. "{count, plural, ...}" -> ["count"]. */
function placeholders(message: string): string[] {
  const names = new Set<string>();
  for (const match of message.matchAll(/\{(\w+)/g)) {
    names.add(match[1]);
  }
  return [...names].sort();
}

const en = loadMessages("en");
const enKeys = keyPaths(en).sort();
const translationLocales = locales.filter((l) => l !== "en");

describe("i18n messages", () => {
  it("every configured locale has a message file", () => {
    for (const locale of locales) {
      const file = path.join(MESSAGES_DIR, `${locale}.json`);
      expect(fs.existsSync(file), `missing messages/${locale}.json`).toBe(true);
    }
  });

  it("no stray message files outside the configured locales", () => {
    const files = fs
      .readdirSync(MESSAGES_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
    for (const file of files) {
      expect(
        (locales as readonly string[]).includes(file),
        `messages/${file}.json is not a configured locale`,
      ).toBe(true);
    }
  });

  describe.each(translationLocales)("locale %s", (locale) => {
    const messages = loadMessages(locale);
    const localeKeys = keyPaths(messages).sort();

    it("has exactly the same keys as English", () => {
      const missing = enKeys.filter((k) => !localeKeys.includes(k));
      const extra = localeKeys.filter((k) => !enKeys.includes(k));
      expect(missing, `${locale} is missing keys`).toEqual([]);
      expect(extra, `${locale} has extra keys`).toEqual([]);
    });

    it("keeps the same interpolation placeholders as English", () => {
      for (const key of enKeys) {
        const enPlaceholders = placeholders(valueAt(en, key));
        const localePlaceholders = placeholders(valueAt(messages, key));
        expect(
          localePlaceholders,
          `${locale} placeholders differ at "${key}"`,
        ).toEqual(enPlaceholders);
      }
    });
  });
});

describe("i18n config", () => {
  it("English is the default locale", () => {
    expect(defaultLocale).toBe("en");
  });

  it("maps known native languages to locales", () => {
    expect(localeFromLanguage("English")).toBe("en");
    expect(localeFromLanguage("Turkish")).toBe("tr");
    expect(localeFromLanguage("German")).toBe("de");
    expect(localeFromLanguage("Spanish")).toBe("es");
    expect(localeFromLanguage("French")).toBe("fr");
    expect(localeFromLanguage("Finnish")).toBe("fi");
  });

  it("falls back to the default locale for unknown or empty languages", () => {
    expect(localeFromLanguage("Klingon")).toBe("en");
    expect(localeFromLanguage(null)).toBe("en");
    expect(localeFromLanguage(undefined)).toBe("en");
  });

  it("recognizes only configured locale codes", () => {
    expect(isAppLocale("en")).toBe(true);
    expect(isAppLocale("de")).toBe(true);
    expect(isAppLocale("xx")).toBe(false);
    expect(isAppLocale(null)).toBe(false);
  });
});
