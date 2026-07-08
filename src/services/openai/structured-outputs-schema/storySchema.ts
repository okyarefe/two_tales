import { z } from "zod";

// Field names are visible to the model — they must not name a specific
// language, otherwise they bias generation (e.g. "english_version" pushes
// the model to write English even when the base language is Turkish).
// The prompt states which concrete language each field must contain.
export const storySchema = z.object({
  base_language_version: z
    .string()
    .min(1, "Base language version is required")
    .describe(
      "The complete story written in the BASE language specified in the prompt"
    ),
  target_language_version: z
    .string()
    .min(1, "Target language version is required")
    .describe(
      "The same story written in the TARGET language specified in the prompt"
    ),
});

export type StorySchema = z.infer<typeof storySchema>;
