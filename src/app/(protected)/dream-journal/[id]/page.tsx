import { getStoryById, getFeedbackByStoryId } from '@/lib/supabase/queries';
import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import type { Story } from '@/types';
import { Button } from '@/components/ui/button';
import { SpeakButton } from '@/components/audio/speak-button';
import { DreamJournalForm } from './dream-journal-form';
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DreamJournalDetailPage({ params }: Props) {
  const props = await params;
  const storyId = props.id;
  const t = await getTranslations('DreamJournal');
  const format = await getFormatter();

  let story: Story | null = null;
  let existingFeedback = null;
  try {
    story = await getStoryById(storyId);

    // Fetch existing feedback if story has feedback_generated = true
    if (story?.feedback_generated) {
      existingFeedback = await getFeedbackByStoryId(storyId);
    }
  } catch {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold mb-4">{t('heading')}</h1>
        <p className="text-sm text-red-600">{t('loadError')}</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dream-journal">{t('back')}</Link>
        </Button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold mb-4">{t('heading')}</h1>
        <p className="text-sm">{t('notFound')}</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/stories">{t('back')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('heading')}</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/stories">{t('back')}</Link>
        </Button>
      </div>

      {/* Original Story Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">
            {story.title ?? t('untitled')}
          </h2>
          <SpeakButton text={story.translated_version} />
        </div>
        <div className="text-xs text-muted-foreground">
          {t('created', {
            date: format.dateTime(new Date(story.created_at), {
              dateStyle: 'medium',
            }),
          })}
        </div>
        <article className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded-lg border text-sm sm:text-base">
          {story.english_version}
        </article>
      </section>

      {/* User Input Section */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('yourTurn')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('instructions', { language: story.translate_to })}
        </p>
        <DreamJournalForm
          storyId={story.id}
          targetLanguage={story.translate_to}
          baseLanguage={story.base_language ?? 'English'}
          storyCheckReference={story.translated_version}
          feedbackGenerated={story.feedback_generated ?? false}
          existingFeedback={existingFeedback}
        />
      </section>
    </div>
  );
}
