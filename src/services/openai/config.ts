export const openAIConfig = {
  models: {
    STORY_GENERATION_MODEL: "gpt-4o-mini-2024-07-18",
    QUIZ_GENERATION_MODEL: "gpt-4o-mini-2024-07-18",
    FEEDBACK_MODEL: "gpt-4o-2024-11-20",
    TTS_MODEL: "gpt-4o-mini-tts",
  },
  systemPrompts: {
    STORY_GENERATION: `You are a creative and professional story writer. You will create stories that will be very helpful for langauge learners`,
    FEEDBACK_GENERATION: `You are an expert language tutor. You give precise, exhaustive grammatical feedback by carefully comparing a learner's writing against a reference text. You never miss mistakes, you never invent mistakes, and you never penalize valid synonyms or stylistic variations.`,
  },
  tts: {
    voice: "alloy",
    format: "mp3" as const,
    bucket: "tts",
    // gpt-4o-mini-tts pricing (per 1M tokens). Used for cost-estimation logs only.
    pricePerMillionInputTokens: 0.6,
  },
  // gpt-4o-2024-11-20 pricing (per 1M tokens). Used for cost-estimation logs only.
  feedbackPricing: {
    inputPerMillion: 2.5,
    outputPerMillion: 10.0,
  },
};
