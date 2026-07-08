"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import AddToFlashcardPopover from "./add-to-flashcard-popover";

interface StorySideBySideProps {
  storyA: string;
  storyB: string;
}

function splitSentences(story: string): string[] {
  return story
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s + ".");
}

export const StorySideBySide: React.FC<StorySideBySideProps> = ({
  storyA,
  storyB,
}) => {
  const t = useTranslations("StoryReader");
  const sentencesA = useMemo(() => splitSentences(storyA), [storyA]);
  const sentencesB = useMemo(() => splitSentences(storyB), [storyB]);
  const maxLen = Math.max(sentencesA.length, sentencesB.length);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hiddenB, setHiddenB] = useState<boolean[]>(Array(maxLen).fill(true));

  useEffect(() => {
    setHiddenB((prev) => {
      if (prev.length === maxLen) return prev;
      const next = Array(maxLen).fill(false);
      for (let i = 0; i < Math.min(prev.length, maxLen); i++) next[i] = prev[i];
      return next;
    });
  }, [maxLen]);

  const toggleSentenceB = useCallback((idx: number) => {
    setHiddenB((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const hideAllB = useCallback(() => {
    setHiddenB(Array(maxLen).fill(true));
  }, [maxLen]);

  const showAllB = useCallback(() => {
    setHiddenB(Array(maxLen).fill(false));
  }, [maxLen]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center sm:justify-end gap-2 mb-3 sm:mb-4 sentence-controls">
        <Button
          variant="accentSoft"
          size="sm"
          className="sentence-controls__btn text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5 font-semibold tracking-wide transition-all"
          onClick={hideAllB}
        >
          {t("hideAll")}
        </Button>
        <Button
          variant="accentSoft"
          size="sm"
          className="sentence-controls__btn text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5 font-semibold tracking-wide transition-all"
          onClick={showAllB}
        >
          {t("showAll")}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:gap-2">
        {Array.from({ length: maxLen }).map((_, idx) => {
          const sourceText = sentencesA[idx] || "";
          const targetText = sentencesB[idx] || "";
          const isHidden = !!hiddenB[idx];
          const isHovered = hoveredIdx === idx;
          const hoverBg = isHovered ? "bg-accent/20" : "";

          return (
            <div
              key={`pair-${idx}`}
              className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 md:gap-6"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Source */}
              <div
                className={`px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-colors duration-150 flex items-start sm:items-center justify-between gap-2 min-h-[52px] sm:min-h-[60px] cursor-pointer ${hoverBg}`}
              >
                <span className="text-base sm:text-lg leading-relaxed flex-1 font-normal tracking-normal">
                  {sourceText}
                </span>
                {sourceText && targetText ? (
                  <AddToFlashcardPopover
                    sourceSentence={sourceText}
                    targetSentence={targetText}
                  />
                ) : (
                  <span
                    className="inline-block h-8 w-[48px] sm:w-[64px] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Target */}
              <div
                className={`px-2 sm:px-3 py-3 sm:py-4 rounded-lg transition-colors duration-150 flex items-start sm:items-center justify-between gap-2 min-h-[52px] sm:min-h-[60px] cursor-pointer ${hoverBg}`}
              >
                <span
                  aria-hidden={isHidden}
                  className={`text-base sm:text-lg leading-relaxed flex-1 font-normal tracking-normal ${isHidden ? "opacity-0 select-none" : ""}`}
                >
                  {targetText}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSentenceB(idx)}
                  aria-label={isHidden ? t("show") : t("hide")}
                  className="text-accent hover:bg-accent/10 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 shrink-0 font-medium"
                >
                  {isHidden ? t("show") : t("hide")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
