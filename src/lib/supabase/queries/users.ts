import { createClient } from '@/lib/supabase/server';

export async function getUserCredits(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('story_credit')
    .eq('id', userId)
    .single();

  if (error) throw new Error('Error fetching user credits');
  return data.story_credit ?? 0;
}

export async function deductUserCredit(userId: string): Promise<boolean> {
  const supabase = await createClient();

  // deduct_credit RPC returns TABLE(success boolean), so Supabase yields an
  // array of rows — read the first row's `success` field, not the array itself.
  const { data, error } = await supabase.rpc('deduct_credit', {
    user_id: userId,
  });

  if (error) throw new Error(error.message);
  return data?.[0]?.success ?? false;
}

export async function getUserNativeLanguage(userId: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('native_language')
    .eq('id', userId)
    .single();

  if (error) throw new Error('Error fetching user language');
  return data.native_language ?? 'English';
}

export async function updateUserNativeLanguage(
  userId: string,
  nativeLanguage: string,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .update({ native_language: nativeLanguage })
    .eq('id', userId);

  if (error) throw new Error('Error updating your language');
}

export async function addStoryCreditsToUser(userId: string, amount: number) {
  const supabase = await createClient();

  const { error } = await supabase.rpc('add_story_credits', {
    user_id_param: userId,
    amount_param: amount,
  });

  if (error) throw error;
}
