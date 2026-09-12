import type { language } from "@/types";

import { DEMO_TARGET_LANGUAGES, DEMO_TOPICS, buildDemoSlug } from "./catalog";
import { GENERATED_DEMO_STORIES } from "./generated";
import type { DemoStory } from "./types";

/**
 * Read API for the pre-generated demo pool.
 *
 * The pool is static data bundled at build time, so every lookup here is a
 * synchronous in-memory read — no awaits, no database, no OpenAI. Pages using
 * these can render statically.
 *
 * The catalog describes what *should* exist; this module reports what actually
 * does. They diverge whenever a story failed to generate, so the UI must always
 * ask this module rather than assuming a catalog entry has a story behind it.
 */

/** Slug -> story, built once at module load. */
const STORIES_BY_SLUG = new Map<string, DemoStory>(
  GENERATED_DEMO_STORIES.map((story) => [story.slug, story]),
);

export function getAllDemoStories(): DemoStory[] {
  return GENERATED_DEMO_STORIES;
}

export function getDemoStoryBySlug(slug: string): DemoStory | undefined {
  return STORIES_BY_SLUG.get(slug);
}

export function getDemoStory(
  targetLanguage: language,
  topicId: string,
): DemoStory | undefined {
  return STORIES_BY_SLUG.get(buildDemoSlug(targetLanguage, topicId));
}

export function hasDemoStory(
  targetLanguage: language,
  topicId: string,
): boolean {
  return STORIES_BY_SLUG.has(buildDemoSlug(targetLanguage, topicId));
}

/** Target languages that have at least one generated story. */
export function getAvailableTargetLanguages(): language[] {
  return DEMO_TARGET_LANGUAGES.filter((lang) =>
    GENERATED_DEMO_STORIES.some((story) => story.targetLanguage === lang),
  );
}

/**
 * Topics with a story in the given language, in catalog order.
 *
 * Catalog order matters: the picker's chips should not reshuffle between
 * languages, or the grid appears to jump when the reader switches.
 */
export function getAvailableTopics(targetLanguage: language) {
  return DEMO_TOPICS.filter((topic) => hasDemoStory(targetLanguage, topic.id));
}

export { DEMO_TOPICS, DEMO_TARGET_LANGUAGES, buildDemoSlug };
export type { DemoStory };
