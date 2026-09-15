import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

import { User } from "@supabase/supabase-js";

/**
 * Returns the signed-in user, or null when there is no session.
 *
 * Wrapped in React `cache()` so that a layout and the page it wraps — which
 * render in the same pass and both need the user — share a single
 * `auth.getUser()` round-trip instead of making one each. `auth.getUser()`
 * validates the JWT against the auth server, so it is a real network call,
 * not a local cookie read.
 *
 * The cache lives for one request only.
 */
export const getOptionalUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
});

/** As `getOptionalUser`, but throws when unauthenticated. */
export async function getUser(): Promise<User> {
  const user = await getOptionalUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
}
