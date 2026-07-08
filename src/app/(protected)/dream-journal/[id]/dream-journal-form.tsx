"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getStoryFeedback } from "@/actions/feedback";
import type {
  FeedbackResponse,
  Mistake,
  MistakeCategory,
  MistakeSeverity,
} from "@/services/openai/structured-outputs-schema/feedbackSchema";

type StoreFeedbackRecord = {
  id: string;
  user_id: string;
  story_id: string;
  feedback_data: FeedbackResponse;
  user_answer: string;
  target_language: string;
  created_at: string;
  updated_at?: string;
};

type DreamJournalFormProps = {
  storyId: string;
  targetLanguage: string;
  baseLanguage?: string;
  storyCheckReference?: string;
  feedbackGenerated: boolean;
  existingFeedback?: StoreFeedbackRecord | null;
};

const SEVERITY_STYLES: Record<MistakeSeverity, string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-slate-100 text-slate-700 border-slate-200",
};

function groupByCategory(mistakes: Mistake[]) {
  const groups = new Map<MistakeCategory, Mistake[]>();
  for (const m of mistakes) {
    const list = groups.get(m.category) ?? [];
    list.push(m);
    groups.set(m.category, list);
  }
  return Array.from(groups.entries());
}

export function DreamJournalForm({
  storyId,
  targetLanguage,
  baseLanguage,
  storyCheckReference,
  feedbackGenerated,
  existingFeedback,
}: DreamJournalFormProps) {
  const t = useTranslations("DreamJournal");
  const [userAnswer, setuserAnswer] = useState(
    existingFeedback?.user_answer || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(
    existingFeedback?.feedback_data || null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || !storyCheckReference) return;

    setIsSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const result = await getStoryFeedback({
        storyId,
        userAnswer,
        storyCheckReference,
        targetLanguage,
        baseLanguage,
      });

      if (result.success && result.feedback) {
        setFeedback(result.feedback);
      } else {
        setError(result.error || t("getFeedbackError"));
      }
    } catch (error) {
      console.error("Error submitting story:", error);
      setError(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="user-story" className="block text-sm font-medium mb-2">
          {t("writeLabel", { language: targetLanguage })}
        </label>
        <Textarea
          id="user-story"
          value={userAnswer}
          onChange={(e) => setuserAnswer(e.target.value)}
          placeholder={t("writePlaceholder", { language: targetLanguage })}
          className="min-h-[300px] resize-y text-sm sm:text-base bg-white"
          disabled={feedbackGenerated}
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={
            !userAnswer.trim() ||
            isSubmitting ||
            !storyCheckReference ||
            feedbackGenerated
          }
          variant="secondary"
        >
          {feedbackGenerated
            ? t("alreadyGenerated")
            : isSubmitting
              ? t("submitting")
              : t("submit")}
        </Button>
      </div>

      {feedbackGenerated && !feedback && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          {t("loadingPrevious")}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {feedback && (
        <div className="space-y-5 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-blue-900">
              {feedback.brief_feedback}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {t("mistakesFound", { count: feedback.mistakes_count })}
            </p>
          </div>

          {feedback.mistakes.length === 0 ? (
            <div className="text-sm text-green-700 font-medium">
              {t("noMistakes")}
            </div>
          ) : (
            <div className="space-y-4">
              {groupByCategory(feedback.mistakes).map(([category, items]) => (
                <div
                  key={category}
                  className="bg-white border border-blue-200 rounded-md p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-blue-900">
                      {t(`category.${category}`)}
                    </h3>
                    <span className="text-xs text-blue-700">
                      {t("mistakeCount", { count: items.length })}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {items.map((m, i) => (
                      <li
                        key={i}
                        className="text-sm border-l-2 border-blue-200 pl-3 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded border ${SEVERITY_STYLES[m.severity]}`}
                          >
                            {t(`severity.${m.severity}`)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 italic">
                          “{m.sentence_context}”
                        </div>

                        <div className="text-xs space-y-0.5">
                          <div>
                            <span className="text-red-700 font-medium">
                              {m.learner_fragment}
                            </span>
                            <span className="text-slate-500"> → </span>
                            <span className="text-green-700 font-medium">
                              {m.correct_fragment}
                            </span>
                          </div>
                          <div className="text-slate-700">{m.explanation}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
