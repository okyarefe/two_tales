import { createClient as createClientClient } from '@/lib/supabase/client';

export async function signInWithGoogle() {
  const supabase = createClientClient();

  const next = new URLSearchParams(window.location.search).get('next');
  const callbackUrl = new URL(
    '/auth/callback',
    process.env.NEXT_PUBLIC_SITE_URL,
  );
  if (next && next.startsWith('/')) {
    callbackUrl.searchParams.set('next', next);
  }

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });
}
