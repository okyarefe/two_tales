'use server';

import { openAiClient } from '@/services/openai/client';
import { openAIConfig } from '@/services/openai/config';
import { feedbackSchema } from '@/services/openai/structured-outputs-schema/feedbackSchema';
import { generateFeedbackPrompt } from '@/services/openai/prompts';
import { zodTextFormat } from 'openai/helpers/zod';
import {
  saveFeedback,
  checkStoryHasFeedback,
  markStoryFeedbackGenerated,
} from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';

interface GetStoryFeedbackProps {
  storyId: string;
  userAnswer: string;
  storyCheckReference: string;
  targetLanguage: string;
}

export async function getStoryFeedback({
  storyId,
  userAnswer,
  storyCheckReference,
  targetLanguage,
}: GetStoryFeedbackProps) {
  try {
    // Auth Check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be signed in to generate feedback');
    }

    // Validate required parameters
    if (!storyId || storyId.trim() === '') {
      throw new Error('storyId is required to save feedback');
    }

    // Check if feedback already generated for this story
    const hasFeedback = await checkStoryHasFeedback(storyId);
    if (hasFeedback) {
      throw new Error('Feedback has already been generated for this story');
    }

    console.log("Generating feedback for user's story...");

    const promptForAI = generateFeedbackPrompt(
      storyCheckReference,
      userAnswer,
      targetLanguage,
    );

    const response = await openAiClient.responses.create({
      model: openAIConfig.models.FEEDBACK_MODEL,
      instructions: openAIConfig.systemPrompts.FEEDBACK_GENERATION,
      input: promptForAI,
      text: { format: zodTextFormat(feedbackSchema, 'feedback_generator') },
    });

    // const usage = response.usage;
    // const inputTokens = usage?.input_tokens ?? 0;
    // const outputTokens = usage?.output_tokens ?? 0;
    // const totalTokens = usage?.total_tokens ?? 0;
    // const { inputPerMillion, outputPerMillion } = openAIConfig.feedbackPricing;
    // const estimatedCostUsd =
    //   (inputTokens / 1_000_000) * inputPerMillion +
    //   (outputTokens / 1_000_000) * outputPerMillion;
    // console.log(
    //   `[Feedback] model=${openAIConfig.models.FEEDBACK_MODEL} input=${inputTokens} output=${outputTokens} total=${totalTokens} ~cost=$${estimatedCostUsd.toFixed(5)}`,
    // );

    const feedbackText = response.output_text;

    if (!feedbackText || feedbackText.trim() === '') {
      console.error('OpenAI returned empty feedback');
      throw new Error('Failed to generate feedback. Please try again.');
    }

    let parsed;
    try {
      parsed = JSON.parse(feedbackText);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Raw feedback content:', feedbackText);
      throw new Error(
        'Failed to parse AI feedback response. Please try again.',
      );
    }

    // Validate with zod schema
    const validated = feedbackSchema.parse(parsed);

    // Save feedback to database
    const savedFeedback = await saveFeedback(
      user.id,
      storyId,
      validated,
      userAnswer,
      targetLanguage,
    );

    // Mark story as feedback generated
    await markStoryFeedbackGenerated(storyId);

    return {
      success: true,
      feedback: validated,
      feedbackId: savedFeedback.id,
    };
  } catch (error) {
    // Log full error details on server
    console.error('Error generating feedback:', error);

    // Return user-friendly error message
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred while generating feedback.',
    };
  }
}
