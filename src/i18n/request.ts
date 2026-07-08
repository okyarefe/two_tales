import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, isAppLocale, LOCALE_COOKIE } from "./config";

// Resolves the active locale from the NEXT_LOCALE cookie (set when the user
// picks their language). Falls back to English for anyone without the cookie
// or a locale we don't have messages for yet.
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isAppLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
