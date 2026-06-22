import { z } from "zod";

export const mistakeCategoryEnum = z.enum([
  "case_ending",
  "verb_conjugation",
  "tense",
  "agreement",
  "possessive",
  "article",
  "gender",
  "preposition",
  "word_order",
  "vocabulary",
  "spelling",
  "punctuation",
  "other",
]);

export const mistakeSeverityEnum = z.enum(["high", "medium", "low"]);

export const mistakeSchema = z.object({
  category: mistakeCategoryEnum.describe(
    "Grammatical category of the mistake."
  ),
  severity: mistakeSeverityEnum.describe(
    "high = changes meaning or is a major grammar error; medium = noticeable but understandable; low = minor stylistic issue."
  ),
  learner_fragment: z
    .string()
    .describe(
      "The exact incorrect fragment from the learner's text (a word or short phrase)."
    ),
  correct_fragment: z
    .string()
    .describe("The corrected version of that fragment."),
  explanation: z
    .string()
    .describe(
      "A 1-2 sentence explanation of WHY the correction is needed, suitable for a language learner."
    ),
  sentence_context: z
    .string()
    .describe(
      "The full learner sentence containing this mistake, for display context."
    ),
});

export const feedbackSchema = z.object({
  mistakes: z
    .array(mistakeSchema)
    .describe(
      "An exhaustive list of every grammatical mistake found in the learner's text. Empty array if the text is correct."
    ),
  mistakes_count: z
    .number()
    .describe("Total number of mistakes in the mistakes array."),
  brief_feedback: z
    .string()
    .describe(
      "A short, encouraging summary message (<= 25 words) about overall performance."
    ),
});

export type MistakeCategory = z.infer<typeof mistakeCategoryEnum>;
export type MistakeSeverity = z.infer<typeof mistakeSeverityEnum>;
export type Mistake = z.infer<typeof mistakeSchema>;
export type FeedbackResponse = z.infer<typeof feedbackSchema>;
