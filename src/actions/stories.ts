'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';
import { languages, languageLevels, grammarTopics } from '@/constants';
import {
  deductUserCredit,
  addStoryCreditsToUser,
  saveQuizQuestions,
  saveStory,
  markStoryFeedbackGenerated,
  checkStoryHasFeedback,
  getUserNativeLanguage,
} from '@/lib/supabase/queries';
import {
  generateQuizFromStory,
  generateStory,
} from '@/services/openai/generateStory';
import { createClient } from '@/lib/supabase/server';
import { Story, storyLength } from '@/types';
import { deleteStoryById, getStoryById } from '@/lib/supabase/queries';

const createStorySchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title should be at least 3 characters long' })
    .regex(/^[\p{L}\s-]+$/u, {
      message: 'Title can only contain letters, spaces, and hyphens',
    }),
  prompt: z
    .string()
    .min(10, { message: 'Description should be at least 10 characters long' }),
  language: z.enum([...languages] as [string, ...string[]], {
    errorMap: () => ({ message: 'Please choose a language' }),
  }),
  languageLevel: z.enum(languageLevels, {
    errorMap: () => ({ message: 'Choose a level' }),
  }),
  topic: z.enum(grammarTopics, {
    errorMap: () => ({ message: 'Choose a topic to study' }),
  }),
});

interface CreateStoryFormState {
  errors: {
    //validation
    languageLevel?: string[];
    language?: string[];
    topic?: string[];
    title?: string[];
    prompt?: string[];
    //form level errors - saving to db, auth etc..
    _form?: string[];
  };
  success?: boolean;
}

export async function createStory(
  formState: CreateStoryFormState,
  formData: FormData,
): Promise<CreateStoryFormState> {
  const result = createStorySchema.safeParse({
    title: formData.get('title'),
    prompt: formData.get('prompt'),
    language: formData.get('language'),
    languageLevel: formData.get('languageLevel'),
    topic: formData.get('topic'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }
  // Auth Check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      errors: { _form: ['You must be signed in to create a story'] },
    };
  }

  // The story pair is base (user's own language, from their profile) ↔ target.
  let baseLanguage: string;
  try {
    baseLanguage = await getUserNativeLanguage(user.id);
  } catch {
    baseLanguage = 'English';
  }

  if (result.data.language === baseLanguage) {
    return {
      errors: {
        language: [
          `You already speak ${baseLanguage} — pick a language to learn, or change your language on the dashboard`,
        ],
      },
      success: false,
    };
  }

  // Reserve a credit atomically BEFORE generating. Two concurrent requests
  // serialize at the DB; only one wins and proceeds to OpenAI. The other is
  // rejected here without spending money.
  let creditReserved = false;
  try {
    creditReserved = await deductUserCredit(user.id);
    if (!creditReserved) {
      return {
        errors: { _form: ['You do not have enough credits to create a story'] },
      };
    }

    const story = await generateStory({ ...result.data, baseLanguage });

    const storyData = {
      english_version: story.base,
      translated_version: story.target,
      level: result.data.languageLevel,
      length: 'medium' as storyLength,
      total_tokens: story.totalTokens,
      user_id: user.id,
      translate_to: result.data.language,
      base_language: baseLanguage,
      title: result.data.title,
    };
    const savedStory: Story = await saveStory(storyData, user.id);

    const quiz = await generateQuizFromStory(story);

    await saveQuizQuestions(
      user.id,
      savedStory.id,
      quiz.questions,
      story.totalTokens,
    );
  } catch (error: unknown) {
    if (creditReserved) {
      try {
        await addStoryCreditsToUser(user.id, 1);
      } catch (refundError) {
        console.error(
          `Credit refund failed for user ${user.id} after story generation error`,
          refundError,
        );
      }
    }

    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }
  revalidatePath('/stories');
  return {
    errors: {},
    success: true,
  };
}

export async function deleteStoryServerAction(storyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to delete a story');
  }

  const story = await getStoryById(storyId);
  if (!story || story.user_id !== user.id) {
    throw new Error(
      'Story not found or you do not have permission to delete it',
    );
  }

  await deleteStoryById(storyId);
  revalidateTag(`story-${storyId}`);
  revalidatePath('/dashboard');
}

export async function markStoryFeedbackGeneratedAction(storyId: string) {
  try {
    await markStoryFeedbackGenerated(storyId);
    revalidatePath('/dream-journal/[id]');
    return { success: true };
  } catch (error) {
    console.error('Error marking story feedback:', error);
    return {
      success: false,
      error: 'Failed to update story feedback status',
    };
  }
}

export async function checkStoryHasFeedbackAction(storyId: string) {
  try {
    const hasFeedback = await checkStoryHasFeedback(storyId);
    return { success: true, hasFeedback };
  } catch (error) {
    console.error('Error checking story feedback:', error);
    return {
      success: false,
      hasFeedback: false,
    };
  }
}
