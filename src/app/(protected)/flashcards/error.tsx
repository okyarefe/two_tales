"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function FlashcardsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Flashcards");
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          {t("errorTitle")}
        </h2>
        <p className="text-sm text-slate-500 max-w-sm">{t("listErrorBody")}</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={reset}>
            {t("tryAgain")}
          </Button>
          <Button asChild>
            <Link href="/flashcards">{t("backToFlashcards")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
