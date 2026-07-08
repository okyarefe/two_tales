import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DreamJournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations("DreamJournal");

  if (!user) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold mb-4">{t("title")}</h1>
        <p className="text-sm">{t("signInPrompt")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-semibold mb-4">{t("title")}</h1>
    </div>
  );
}
