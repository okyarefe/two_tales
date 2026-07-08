import { languageLevel, storyLength } from "@/types";
import { languageLevelDescriptions } from "@/constants";

export function generateOpenAIStoryPrompt(
  prompt: string,
  baseLanguage: string,
  targetLanguage: string,
  level: languageLevel,
  length: storyLength,
  topic?: string
): string {
  const numberOfSentences =
    length === "short" ? 15 : length === "medium" ? 25 : 40;

  const topicLine = topic ? `Focus on practicing ${topic}.` : "";
  const levelGuideline = languageLevelDescriptions[level] || "";

  return `${prompt} ${topicLine}
          The story request above may be written in any language.
          I want to hear the same story in ${baseLanguage} and ${targetLanguage}.

          BASE language: ${baseLanguage} — put this story in the "base_language_version" field.
          TARGET language: ${targetLanguage} — put this story in the "target_language_version" field.

          LANGUAGE LEVEL REQUIREMENT (${level}):
          ${levelGuideline}

          Apply these guidelines strictly to BOTH the ${baseLanguage} and ${targetLanguage} versions.

          First, give me the complete ${baseLanguage} story, then the same story in ${targetLanguage}. Do not mix any content!

          Make sure:
          - The number of sentences in both stories are exactly the same.
          - Each sentence corresponds directly to the sentence in the other language.
          - Each story must have ${numberOfSentences} sentences. Ignore if otherwise specified.
          - Do not include any ** or other special formatting characters in the sentences.
          - Follow the ${level} level guidelines strictly.

          Please ensure that both stories match sentence-for-sentence precisely.`;
}

export function extractStories(text: string): {
  english: string;
  translated: string;
} {
  const englishMatch = text.match(/English:\s*([\s\S]*?)\s*Turkish:/i);
  const translatedMatch = text.match(/Turkish:\s*([\s\S]*)/i);

  return {
    english: englishMatch?.[1]?.trim() ?? "",
    translated: translatedMatch?.[1]?.trim() ?? "",
  };
}

export function getTranslatedStory(
  stories: Record<string, string> | undefined
): string | null {
  if (!stories) return null;

  for (const [key, value] of Object.entries(stories)) {
    if (key.toLowerCase() !== "english" && value) {
      return value;
    }
  }

  return null;
}

export function generateFeedbackPrompt(
  reference: string,
  learnerText: string,
  language: string,
  explanationLanguage: string = "English"
): string {
  return `You are reviewing a language-learning exercise in ${language}.

You will be given:
1. REFERENCE — the correct ${language} text the learner was meant to reproduce.
2. LEARNER — the learner's attempt.

Your task: find every grammatical mistake in LEARNER by comparing it against REFERENCE.

PROCEDURE
1. Align LEARNER with REFERENCE sentence-by-sentence.
2. For each sentence pair, identify every word or phrase that differs.
3. For each difference, decide:
   - Is it an equivalent variation (synonym, valid alternative phrasing, equally correct word choice)? If yes, IGNORE it. Do not penalize valid synonyms.
   - Is it a grammatical error (wrong case, wrong conjugation, wrong agreement, wrong word order, missing/extra word, misspelling, wrong tense, wrong preposition, etc.)? If yes, REPORT it.
4. Be exhaustive. Find ALL errors, including small ones. Do not stop at the first few.
5. Do NOT invent errors. If LEARNER matches REFERENCE meaning correctly with different but valid wording, that is not a mistake.

OUTPUT FIELDS
For each mistake, return:
- category: pick the single best-fitting category from the schema enum. Use these disambiguation rules — they override your default instinct:
    * case_ending: ANY noun/pronoun/adjective in the wrong grammatical case (e.g. nominative where adessive/inessive/partitive/genitive is needed, like "Hän on" instead of "Hänellä on", or "Kesässä" instead of "Kesällä"). DO NOT label these as vocabulary or agreement.
    * agreement: ONLY for subject-verb number/person mismatches ("He leikkii" → "He leikkivät") or adjective-noun number/case mismatches. NOT for case errors.
    * vocabulary: ONLY when the learner used a genuinely wrong WORD (different lemma). A wrong FORM of the correct word is NOT vocabulary.
    * tense: past/present/perfect/future mix-ups on a correctly-conjugated verb.
    * verb_conjugation: use only when the verb form is wrong but it's NOT a tense issue and NOT a subject-verb agreement issue (e.g. wrong infinitive, wrong participle, wrong infinitive construction such as 3rd-infinitive vs E-infinitive temporal). Even if the surrounding noun's case also changes to fit the construction, classify as verb_conjugation, not word_order.
    * possessive: missing or wrong possessive suffix/pronoun ("isän" → "isänsä").
    * spelling: typo on an otherwise correctly-formed word.
    * word_order: ONLY when the same words appear in a different sequence (e.g. "kirja punainen" → "punainen kirja"). NOT for changes in word form, case, infinitive construction, or any other structural rewrite where the words themselves are not reordered.
- severity: "high" if it changes meaning or is a grammatical breakdown; "medium" if noticeable but understandable; "low" if minor.
- learner_fragment: the exact incorrect word/phrase from LEARNER (not the whole sentence).
- correct_fragment: the corrected version of just that fragment.
- explanation: 1-2 sentences explaining the rule, written for a language learner, in ${explanationLanguage}.
- sentence_context: the full LEARNER sentence the mistake appears in.

Then:
- mistakes_count: integer total of mistakes in the array.
- brief_feedback: encouraging 1-sentence summary (<= 25 words), written in ${explanationLanguage}.

REFERENCE (correct ${language}):
"""
${reference}
"""

LEARNER (${language}):
"""
${learnerText}
"""`;
}
