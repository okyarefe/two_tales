// components/story/StoryActions.tsx
"use client";

import { BookOpen, Trash, MessagesSquare } from "lucide-react";
import { deleteStoryServerAction } from "@/actions/stories";
import { openDreamJournal } from "@/actions/user-data";
import { useState } from "react";
import ConfirmationWindow from "../common/confirmation-window";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface StoryActionsProps {
  storyId: string;
}

export default function StoryActionButtons({ storyId }: StoryActionsProps) {
  const t = useTranslations("StoryActions");
  const [, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setShowConfirm(true);
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteStoryServerAction(storyId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      alert(t("deleteError"));
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  async function handleDreamJournal() {
    try {
      await openDreamJournal();
      // If successful, navigate to dream journal page
      router.push(`/dream-journal/${storyId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(t("dreamJournalError"), {
          position: "top-center",
          style: {
            backgroundColor: "white",
            color: "red",
            borderColor: "red",
          },
        });
      } else {
        alert(t("dreamJournalErrorRetry"));
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 pt-2">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="accent"
          size="sm"
          className="h-9 px-3 text-sm font-semibold"
        >
          <Link
            href={`/stories/${storyId}`}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> {t("read")}
          </Link>
        </Button>

        <Button
          onClick={handleDreamJournal}
          variant="accentSoft"
          size="sm"
          className="h-9 px-3 text-sm font-semibold"
        >
          <MessagesSquare className="w-4 h-4" />
          <span>{t("test")}</span>
        </Button>

        <Button
          onClick={handleDelete}
          variant="destructiveGhost"
          size="sm"
          className="h-9 px-3 text-sm font-semibold flex items-center gap-2"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>

      <ConfirmationWindow
        open={showConfirm}
        title={t("confirmTitle")}
        message={t("confirmMessage")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
