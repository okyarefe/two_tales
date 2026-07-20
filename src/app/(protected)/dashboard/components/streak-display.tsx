import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getUserStoryDatesInRange } from '@/lib/supabase/queries/stories';
import {
  buildWeeklyActivity,
  countActiveDays,
  getWeekRange,
} from '@/utils/date-utils';

export async function StreakDisplay({ userId }: { userId: string }) {
  const t = await getTranslations('Dashboard');

  const { start, end } = getWeekRange();

  let storyDates: string[] = [];
  try {
    storyDates = await getUserStoryDatesInRange(userId, start, end);
  } catch {
    // Activity is non-critical — render an empty week rather than break the dashboard.
  }

  const weeklyActivity = buildWeeklyActivity(start, storyDates);
  const activeDaysThisWeek = countActiveDays(weeklyActivity);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="size-5 text-orange-500" />
          {t('weeklyActivityTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-6 border border-orange-100">
          <Flame className="size-10 text-orange-500" />
          <div>
            <div className="text-4xl font-bold text-orange-600">
              {activeDaysThisWeek}
            </div>
            <div className="text-sm text-orange-500 font-medium">
              {t('activeDays')}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between gap-1.5">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-1.5">
                <div
                  className={`size-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    day.active
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {day.active ? (
                    <Flame className="size-4" />
                  ) : (
                    <span className="text-xs">{day.day[0]}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
