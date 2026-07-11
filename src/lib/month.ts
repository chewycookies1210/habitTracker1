import { Habit, behaviorFor, dayTypeFor } from "./habits";

export function daysInMonth(year: number, month: number): number {
  // month is 1-12
  return new Date(year, month, 0).getDate();
}

export function monthDates(year: number, month: number): Date[] {
  const count = daysInMonth(year, month);
  return Array.from({ length: count }, (_, i) => new Date(year, month - 1, i + 1));
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function isExpected(habit: Habit, date: Date): boolean {
  return behaviorFor(habit, dayTypeFor(date)) === "expected";
}

export function isHidden(habit: Habit, date: Date): boolean {
  return behaviorFor(habit, dayTypeFor(date)) === "hidden";
}

export function isAchieved(habit: Habit, value: number): boolean {
  return habit.inputType === "counter" ? value >= (habit.counterMax ?? 3) : value > 0;
}

/**
 * Completion ratio over a set of dates, counting only days where the habit
 * is "expected" (not optional/hidden, and not in the future). Checks on
 * optional/hidden days are bonus and never lower or inflate this ratio,
 * consistent with the app's no-guilt framing for those days.
 */
export function ratioForDates(
  habit: Habit,
  dates: Date[],
  valueFor: (dateISO: string) => number,
  toISO: (d: Date) => string,
  today: Date
): { done: number; goal: number } {
  let done = 0;
  let goal = 0;
  for (const d of dates) {
    if (d > today) continue;
    if (!isExpected(habit, d)) continue;
    goal += 1;
    if (isAchieved(habit, valueFor(toISO(d)))) done += 1;
  }
  return { done, goal };
}
