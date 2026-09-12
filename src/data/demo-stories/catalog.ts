import type { language, languageLevel, storyLength } from "@/types";

/**
 * The demo catalog: which stories exist in the pre-generated pool.
 *
 * This is the single source of truth for both the generator script and the UI.
 * The picker renders its chips and dropdown from here, so adding a topic means
 * editing this file and re-running `scripts/generate-demo-stories.ts` — the
 * pages pick it up with no further changes.
 */

/** Topics chosen for search intent — each maps to a real thing people learn for. */
export interface DemoTopic {
  id: string;
  label: string;
  /** Emoji shown on the picker chip. */
  icon: string;
  /** Title shown on the story page, in the base language. */
  title: string;
  /** Steers the model beyond the bare topic word. */
  premise: string;
}

export const DEMO_TOPICS: readonly DemoTopic[] = [
  {
    id: "football",
    label: "Football",
    icon: "⚽",
    title: "The Last Minute",
    premise:
      "a young player's last-minute chance to win an important football match",
  },
  {
    id: "cooking",
    label: "Cooking",
    icon: "🍳",
    title: "My Grandmother's Recipe",
    premise:
      "someone cooking their grandmother's recipe for the first time and getting it slightly wrong",
  },
  {
    id: "space",
    label: "Space",
    icon: "🚀",
    title: "Something Outside the Window",
    premise:
      "an astronaut noticing something unexpected during a routine spacewalk",
  },
  {
    id: "horror",
    label: "Horror",
    icon: "👻",
    title: "The Night Watchman",
    premise:
      "a night watchman in an old museum hearing footsteps that stop when he does",
  },
  {
    id: "travel",
    label: "Travel",
    icon: "✈️",
    title: "The Train I Missed",
    premise:
      "a traveller missing their train and discovering a better route by accident",
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: "🎮",
    title: "One More Try",
    premise:
      "two online friends who have never met finally beating a game they struggled with for months",
  },
  {
    id: "cats",
    label: "Cats",
    icon: "🐈",
    title: "The Bookshop Cat",
    premise:
      "a stray cat who adopts a bookshop and slowly changes the owner's routine",
  },
  {
    id: "music",
    label: "Music",
    icon: "🎸",
    title: "The Same Song",
    premise:
      "a street musician who plays the same song every day until one listener asks why",
  },
  {
    id: "mystery",
    label: "Mystery",
    icon: "🔍",
    title: "Returned Every Friday",
    premise:
      "a librarian noticing the same book returned every Friday by a different person",
  },
  {
    id: "coffee",
    label: "Coffee",
    icon: "☕",
    title: "A Note on the Cup",
    premise:
      "a barista who writes a small note on one customer's cup every morning for a year",
  },
  {
    id: "romance",
    label: "Romance",
    icon: "💌",
    title: "The Shared Stairwell",
    premise:
      "two neighbours who communicate only through notes left on a shared stairwell",
  },
  {
    id: "sea",
    label: "The Sea",
    icon: "🌊",
    title: "Reading the Weather",
    premise: "an old fisherman teaching his granddaughter to read the weather",
  },
] as const;

/** Languages offered in the demo. Base is always English in this batch. */
export const DEMO_BASE_LANGUAGE: language = "English";

export const DEMO_TARGET_LANGUAGES: readonly language[] = [
  "Spanish",
  "French",
  "German",
  "Turkish",
] as const;

/** B1 reads as real prose while staying understandable to most learners. */
export const DEMO_LEVEL: languageLevel = "B1";

/** "short" asks the prompt builder for 15 sentences — a under-a-minute read. */
export const DEMO_LENGTH: storyLength = "short";

/**
 * Sentences the prompt asks for at DEMO_LENGTH. The generator uses this only as
 * a sanity bound; the hard requirement is that both languages agree with each
 * other, not that they hit this number exactly.
 */
export const DEMO_SENTENCE_COUNT = 15;

/**
 * Builds the URL slug for a story. Kept here (not inlined) so the generator and
 * the routes can never drift apart.
 */
export function buildDemoSlug(
  targetLanguage: language,
  topicId: string,
): string {
  return `${targetLanguage.toLowerCase()}-${topicId}`;
}

export function findTopic(topicId: string): DemoTopic | undefined {
  return DEMO_TOPICS.find((topic) => topic.id === topicId);
}
