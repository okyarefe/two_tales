import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getUserStoryDatesInRange } from '@/lib/supabase/queries/stories';
import { getPaddedWeekRange } from '@/utils/date-utils';
import { WeeklyActivity } from './weekly-activity';

export async function StreakDisplay({ userId }: { userId: string }) {
  const t = await getTranslations('Dashboard');

  // Padded, because the viewer's week boundaries depend on a timezone the
  // server doesn't know. WeeklyActivity narrows this to the real seven days.
  const { start, end } = getPaddedWeekRange();

  let storyDates: string[] = [];
  try {
    storyDates = await getUserStoryDatesInRange(userId, start, end);
  } catch {
    // Activity is non-critical — render an empty week rather than break the dashboard.
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="size-5 text-orange-500" />
          {t('weeklyActivityTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WeeklyActivity timestamps={storyDates} />
      </CardContent>
    </Card>
  );
}
