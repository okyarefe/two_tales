import type { language, languageLevel } from "@/types";

/**
 * One sentence of a demo story, in both languages.
 *
 * Stories are stored pre-split and pre-paired rather than as two blobs of prose
 * so the renderer never has to guess at sentence boundaries. The generator
 * script is responsible for producing aligned pairs and rejects any story where
 * the two languages disagree on sentence count.
 */
export interface DemoSentencePair {
  base: string;
  target: string;
}

/**
 * A pre-generated bilingual story served to logged-out visitors.
 *
 * These are produced once by `scripts/generate-demo-stories.ts` and committed
 * as static data — no OpenAI call and no database read happens at request time.
 */
export interface DemoStory {
  /** URL segment, e.g. "spanish-football". Unique across the catalog. */
  slug: string;
  /** Catalog topic id this story was generated from, e.g. "football". */
  topicId: string;
  /** Human-readable topic, e.g. "Football". */
  topicLabel: string;
  /** The language the reader already speaks. English for the current batch. */
  baseLanguage: language;
  /** The language being learned. */
  targetLanguage: language;
  level: languageLevel;
  /** Story title in the base language. */
  title: string;
  sentences: DemoSentencePair[];
}
