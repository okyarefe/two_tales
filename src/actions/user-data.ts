'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserStoriesCount } from '@/lib/supabase/queries/stories';
import { getUserFlashcardsCount } from '@/lib/supabase/queries/flashcards';
import { updateUserNativeLanguage } from '@/lib/supabase/queries';
import { languages } from '@/constants';
import type { ActionResult, UserData } from '@/types';

export async function getUserData(userId: string): Promise<UserData | null> {
  const supabase = await createClient();

  try {
    const [userResult, storiesCreated, flashcardsCreated] = await Promise.all([
      supabase
        .from('users')
        .select(
          'email, role, membership_type, story_credit, tts_credit, native_language',
        )
        .eq('id', userId)
        .single(),
      getUserStoriesCount(userId),
      getUserFlashcardsCount(userId),
    ]);

    const { data: userData, error: userError } = userResult;

    if (userError) {
      console.error('Error fetching user data:', userError);
      return null;
    }

    return {
      id: userId,
      email: userData.email || '',
      role: userData.role || 'user',
      membershipType: userData.membership_type || 'free',
      storyCredit: userData.story_credit || 0,
      ttsCredit: userData.tts_credit || 0,
      storiesCreated,
      flashcardsCreated,
      nativeLanguage: userData.native_language || 'English',
    };
  } catch (error) {
    console.error('Error in getUserData:', error);
    return null;
  }
}

export async function updateNativeLanguage(
  nativeLanguage: string,
): Promise<ActionResult<string>> {
  try {
    if (!(languages as readonly string[]).includes(nativeLanguage)) {
      return { success: false, error: 'Please choose a valid language' };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be signed in to change your language',
      };
    }

    await updateUserNativeLanguage(user.id, nativeLanguage);
    return { success: true, data: nativeLanguage };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error updating your language',
    };
  }
}

export async function refreshUserCredits(userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('story_credit, tts_credit')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return {
      storyCredit: data?.story_credit || 0,
      ttsCredit: data?.tts_credit || 0,
    };
  } catch (error) {
    console.error('Error refreshing credits:', error);
    return null;
  }
}

// Server action to check membership before allowing access to Dream Journal
export async function openDreamJournal() {
  const supabase = await createClient();

  // Get auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to access the Dream Journal.');
  }

  // Fetch membership_type from users table
  // const { data: userData, error } = await supabase
  //   .from("users")
  //   .select("membership_type")
  //   .eq("id", user.id)
  //   .single();

  // if (error) {
  //   console.error("Error fetching membership_type:", error);
  //   throw new Error("Unable to verify membership. Please try again.");
  // }

  // // If membership is 'member', throw an error as requested
  // if (userData?.membership_type != "premium") {
  //   throw new Error("Dream Journal is available only for premium members");
  // }

  // Otherwise allow access
  return { ok: true };
}
