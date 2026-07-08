import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  LOCALE_COOKIE,
  localeFromLanguage,
  languageFromLocale,
  isAppLocale,
  defaultLocale,
} from "@/i18n/config";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/dashboard";
  }

  // Locale to apply to the app UI after login. Start from the language the
  // visitor was already browsing in (cookie); a returning user's stored
  // native_language overrides it, and a brand-new signup adopts it.
  const cookieStore = await cookies();
  const browsingLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  let localeToSet = isAppLocale(browsingLocale) ? browsingLocale : defaultLocale;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // Create user profile if it doesn't exist (using admin client to bypass RLS)
    if (!error) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const adminClient = createAdminClient();

          // Check if user exists
          const { data: existingUser } = await adminClient
            .from("users")
            .select("id, native_language")
            .eq("id", user.id)
            .maybeSingle();

          if (existingUser) {
            localeToSet = localeFromLanguage(existingUser.native_language);
          }

          // Create user if doesn't exist — adopt the language they were
          // browsing in as their native_language.
          if (!existingUser) {
            const { error: insertError } = await adminClient
              .from("users")
              .insert({
                id: user.id,
                email: user.email,
                role: "user",
                membership_type: "basic",
                story_credit: 5,
                tts_credit: 0,
                native_language: languageFromLocale(localeToSet),
              });

            if (insertError) {
              console.error("❌ Error creating user profile:", insertError);
            } else {
              // console.log(
              //   "✅ User profile created successfully for:",
              //   user.email
              // );
            }
          }
        }
      } catch (err) {
        console.error("❌ Error in user creation flow:", err);
      }
    }

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      let redirectUrl: string;
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${origin}${next}`;
      }

      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set(LOCALE_COOKIE, localeToSet, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
      return response;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
