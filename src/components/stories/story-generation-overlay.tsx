'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

export type GenerationStatus = 'idle' | 'generating' | 'success';

const STAGE_COUNT = 4;
const STAGE_INTERVAL_MS = 3000;

interface StoryGenerationOverlayProps {
  status: GenerationStatus;
}

export default function StoryGenerationOverlay({
  status,
}: StoryGenerationOverlayProps) {
  const t = useTranslations('StoryOverlay');
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status !== 'generating') return;

    setStageIndex(0);
    setProgress(0);

    const stageTimer = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGE_COUNT - 1));
    }, STAGE_INTERVAL_MS);

    // Ease toward 90% and hold there until the request actually finishes
    const progressTimer = setInterval(() => {
      setProgress((p) => p + (90 - p) * 0.04);
    }, 100);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, [status]);

  const isSuccess = status === 'success';

  // Portal to <body> so ancestors with transform/backdrop-filter (e.g. the
  // sticky header's backdrop-blur) can't clip the fixed-position overlay
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          key="story-generation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mx-4 w-full max-w-sm space-y-6 rounded-3xl bg-white p-8 text-center shadow-xl"
          >
            <div className="relative mx-auto w-fit">
              <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-accent/10 opacity-50 blur-xl" />
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <CheckCircle2 className="relative z-10 h-12 w-12 text-accent" />
                </motion.div>
              ) : (
                <BookOpenText className="relative z-10 h-12 w-12 animate-pulse text-accent" />
              )}
            </div>

            <div className="relative h-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={isSuccess ? 'success' : stageIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-medium text-slate-700"
                >
                  {isSuccess ? t('ready') : t(`stage${stageIndex}`)}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${isSuccess ? 100 : progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>

            {!isSuccess && (
              <p className="text-xs text-slate-400">{t('estimate')}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
