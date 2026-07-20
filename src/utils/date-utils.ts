import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subDays,
} from 'date-fns';

/** Weeks run Monday → Sunday (date-fns numbers days 0 = Sunday). */
export const WEEK_STARTS_ON = 1;

export interface DayActivity {
  /** Short weekday label, e.g. "Mon". */
  day: string;
  /** Calendar date as "yyyy-MM-dd". */
  date: string;
  active: boolean;
}

/**
 * Monday 00:00:00.000 through Sunday 23:59:59.999 of the week containing
 * `reference`. Both edges are inclusive, so they can be used directly as
 * query bounds.
 */
export function getWeekRange(reference: Date = new Date()) {
  return {
    start: startOfWeek(reference, { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(reference, { weekStartsOn: WEEK_STARTS_ON }),
  };
}

/**
 * The current week widened by a day on each side.
 *
 * The server renders in its own timezone (UTC in production) and cannot know
 * the viewer's, so it cannot pin their week boundaries exactly. Offsets span
 * UTC-12 to UTC+14, so padding by a full day guarantees the viewer's real week
 * is contained in the result. The browser then narrows it down precisely.
 */
export function getPaddedWeekRange(reference: Date = new Date()) {
  const { start, end } = getWeekRange(reference);

  return {
    start: subDays(start, 1),
    end: addDays(end, 1),
  };
}

/**
 * Maps timestamps onto the seven days of the week beginning at `weekStart`.
 * A day is active when at least one timestamp falls on it; time of day is
 * ignored, and multiple timestamps on one day still count as a single day.
 */
export function buildWeeklyActivity(
  weekStart: Date,
  timestamps: string[],
): DayActivity[] {
  const activeDates = timestamps.map((timestamp) => new Date(timestamp));

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);

    return {
      day: format(date, 'EEE'),
      date: format(date, 'yyyy-MM-dd'),
      active: activeDates.some((activeDate) => isSameDay(activeDate, date)),
    };
  });
}

/** Number of days in the week that had at least one activity. */
export function countActiveDays(week: DayActivity[]): number {
  return week.filter((day) => day.active).length;
}
