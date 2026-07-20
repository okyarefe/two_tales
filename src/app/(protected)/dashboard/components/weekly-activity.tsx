'use client';

import { Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
  buildWeeklyActivity,
  countActiveDays,
  getWeekRange,
  type DayActivity,
} from '@/utils/date-utils';

interface WeeklyActivityProps {
  /** Story timestamps covering the padded week, straight from the server. */
  timestamps: string[];
}

export function WeeklyActivity({ timestamps }: WeeklyActivityProps) {
  const t = useTranslations('Dashboard');

  const [week, setWeek] = useState<DayActivity[] | null>(null);

  useEffect(() => {
    console.log('renderinggg');
    const { start } = getWeekRange();
    setWeek(buildWeeklyActivity(start, timestamps));
  }, [timestamps]);

  if (!week) {
    return (
      <div className="space-y-6">
        <div className="h-[108px] animate-pulse rounded-lg bg-slate-100" />
        <div className="flex justify-between gap-1.5">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <div className="size-9 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-2.5 w-6 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-6 border border-orange-100">
        <Flame className="size-10 text-orange-500" />
        <div>
          <div className="text-4xl font-bold text-orange-600">
            {countActiveDays(week)}
          </div>
          <div className="text-sm text-orange-500 font-medium">
            {t('activeDays')}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-1.5">
        {week.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
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
  );
}
