/**
 * One-time generator for the logged-out demo story pool.
 *
 *   npx tsx scripts/generate-demo-stories.ts
 *   npx tsx scripts/generate-demo-stories.ts --only=spanish-football,french-cats
 *   npx tsx scripts/generate-demo-stories.ts --force
 *
 * Walks DEMO_TOPICS × DEMO_TARGET_LANGUAGES, calls the app's own
 * `generateStory()`, splits each result into aligned sentence pairs, and writes
 * `src/data/demo-stories/generated.ts`.
 *
 * Results are cached in `scripts/demo-stories.cache.json` so a re-run only pays
 * for what is missing. Pass --force to regenerate everything, or --only=<slugs>
 * to redo specific stories whose output you did not like.
 *
 * Cost note: this uses gpt-4o-mini at "short" length — the full 48-story batch
 * runs to a few cents. Nothing here executes at request time.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  DEMO_BASE_LANGUAGE,
  DEMO_LENGTH,
  DEMO_LEVEL,
  DEMO_TARGET_LANGUAGES,
  DEMO_TOPICS,
  buildDemoSlug,
} from "@/data/demo-stories/catalog";
import type { DemoStory } from "@/data/demo-stories/types";

/**
 * Imported lazily in `main()` rather than at the top of the file.
 *
 * `services/openai/client.ts` constructs the OpenAI client as a module side
 * effect, which would run — and throw on a missing key — before `loadEnv()` had
 * a chance to populate `process.env`.
 */
type GenerateStory =
  typeof import("@/services/openai/generateStory").generateStory;
let generateStory: GenerateStory;

// Resolved from the working directory rather than __dirname, which is not
// defined when the runner treats this file as ESM. Run from the repo root.
const ROOT = process.cwd();
const CACHE_PATH = resolve(ROOT, "scripts/demo-stories.cache.json");
const OUTPUT_PATH = resolve(ROOT, "src/data/demo-stories/generated.ts");

/** Attempts per story before we give up and report it. */
const MAX_ATTEMPTS = 3;
/** Courtesy pause between calls so we never trip a rate limit. */
const DELAY_MS = 400;

// --------------------------------------------------------------------------
// env
// --------------------------------------------------------------------------

/**
 * Minimal .env reader. Avoids adding a dependency just for a script that runs
 * a handful of times, and avoids relying on Node's --env-file flag surviving
 * the tsx wrapper.
 */
function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(ROOT, file);
    if (!existsSync(path)) continue;

    for (const rawLine of readFileSync(path, "utf8").split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const eq = line.indexOf("=");
      if (eq === -1) continue;

      const key = line.slice(0, eq).trim();
      if (process.env[key]) continue; // real env wins over the file

      process.env[key] = line
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
}

// --------------------------------------------------------------------------
// text handling
// --------------------------------------------------------------------------

/**
 * Splits prose into sentences on terminal punctuation.
 *
 * Deliberately simple: these are graded-reader stories with no abbreviations or
 * decimals, so the naive rule holds. Correctness is enforced downstream by the
 * alignment check rather than by the splitter being clever.
 */
function splitSentences(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?…])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * Pairs the two language versions sentence by sentence.
 *
 * Returns null when the versions disagree on sentence count — a story we cannot
 * display side by side is a story we do not ship, so the caller retries.
 */
function pairSentences(
  base: string,
  target: string,
): DemoStory["sentences"] | null {
  const baseSentences = splitSentences(base);
  const targetSentences = splitSentences(target);

  if (baseSentences.length === 0) return null;
  if (baseSentences.length !== targetSentences.length) return null;

  return baseSentences.map((sentence, index) => ({
    base: sentence,
    target: targetSentences[index],
  }));
}

// --------------------------------------------------------------------------
// generation
// --------------------------------------------------------------------------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Job {
  slug: string;
  topicId: string;
  topicLabel: string;
  title: string;
  premise: string;
  targetLanguage: (typeof DEMO_TARGET_LANGUAGES)[number];
}

function buildJobs(): Job[] {
  return DEMO_TARGET_LANGUAGES.flatMap((targetLanguage) =>
    DEMO_TOPICS.map((topic) => ({
      slug: buildDemoSlug(targetLanguage, topic.id),
      topicId: topic.id,
      topicLabel: topic.label,
      title: topic.title,
      premise: topic.premise,
      targetLanguage,
    })),
  );
}

async function generateOne(job: Job): Promise<DemoStory | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { base, target } = await generateStory({
        title: job.title,
        prompt: `Write a story about ${job.premise}.`,
        language: job.targetLanguage,
        baseLanguage: DEMO_BASE_LANGUAGE,
        languageLevel: DEMO_LEVEL,
        length: DEMO_LENGTH,
      });

      const sentences = pairSentences(base, target);
      if (!sentences) {
        console.warn(
          `  attempt ${attempt}/${MAX_ATTEMPTS}: sentence counts did not align, retrying`,
        );
        continue;
      }

      return {
        slug: job.slug,
        topicId: job.topicId,
        topicLabel: job.topicLabel,
        baseLanguage: DEMO_BASE_LANGUAGE,
        targetLanguage: job.targetLanguage,
        level: DEMO_LEVEL,
        title: job.title,
        sentences,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`  attempt ${attempt}/${MAX_ATTEMPTS} failed: ${message}`);
    }
  }

  return null;
}

// --------------------------------------------------------------------------
// output
// --------------------------------------------------------------------------

function readCache(): Record<string, DemoStory> {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  } catch {
    console.warn("Cache unreadable, starting fresh.");
    return {};
  }
}

function writeGeneratedModule(stories: DemoStory[]): void {
  const banner = `// AUTO-GENERATED by scripts/generate-demo-stories.ts — do not edit by hand.
// Regenerate with: npx tsx scripts/generate-demo-stories.ts
// Generated ${new Date().toISOString().slice(0, 10)} · ${stories.length} stories

import type { DemoStory } from "./types";

export const GENERATED_DEMO_STORIES: DemoStory[] = `;

  writeFileSync(
    OUTPUT_PATH,
    `${banner}${JSON.stringify(stories, null, 2)};\n`,
    "utf8",
  );
}

// --------------------------------------------------------------------------
// main
// --------------------------------------------------------------------------

async function main(): Promise<void> {
  loadEnv();

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set (checked .env.local and .env).");
    process.exit(1);
  }

  ({ generateStory } = await import("@/services/openai/generateStory"));

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const onlyArg = args.find((a) => a.startsWith("--only="));
  const only = onlyArg
    ? new Set(onlyArg.slice("--only=".length).split(",").filter(Boolean))
    : null;

  const cache = readCache();
  const jobs = buildJobs().filter((job) => (only ? only.has(job.slug) : true));

  if (jobs.length === 0) {
    console.error("No jobs matched. Check your --only= slugs.");
    process.exit(1);
  }

  const failures: string[] = [];
  let generated = 0;
  let reused = 0;

  for (const [index, job] of jobs.entries()) {
    const position = `[${index + 1}/${jobs.length}]`;

    const shouldReuse = !force && !only?.has(job.slug) && cache[job.slug];
    if (shouldReuse) {
      reused++;
      continue;
    }

    console.log(`${position} ${job.slug}`);
    const story = await generateOne(job);

    if (story) {
      cache[job.slug] = story;
      generated++;
      // Persist after every success so an interrupted run loses nothing.
      writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
    } else {
      failures.push(job.slug);
      console.error(`  giving up on ${job.slug}`);
    }

    await sleep(DELAY_MS);
  }

  // Emit in catalog order so the committed file has a stable, reviewable diff.
  const ordered = buildJobs()
    .map((job) => cache[job.slug])
    .filter(Boolean);

  writeGeneratedModule(ordered);

  console.log(
    `\nDone. generated ${generated}, reused ${reused}, total ${ordered.length}.`,
  );
  console.log(`Wrote ${OUTPUT_PATH}`);

  if (failures.length > 0) {
    console.log(`\nFailed (${failures.length}):`);
    for (const slug of failures) console.log(`  ${slug}`);
    console.log(`\nRetry with: npx tsx scripts/generate-demo-stories.ts --only=${failures.join(",")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
