export type Category = "non_negotiable" | "structured" | "bad";
export type Behavior = "expected" | "optional" | "hidden";
export type DayType = "weekday" | "weekend";

export type Habit = {
  id: string;
  name: string;
  category: Category;
  weekdayBehavior: Behavior;
  weekendBehavior: Behavior;
  sortOrder: number;
  /** "toggle" = 0/1 checkbox, "counter" = 0..max tap-counter */
  inputType: "toggle" | "counter";
  counterMax?: number;
};

export const HABITS: Habit[] = [
  { id: "morning_routine", name: "Morning routine", category: "non_negotiable", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 10, inputType: "toggle" },
  { id: "phoneless_morning", name: "Phoneless time — start of day", category: "non_negotiable", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 20, inputType: "toggle" },
  { id: "phoneless_evening", name: "Phoneless time — end of day", category: "non_negotiable", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 30, inputType: "toggle" },
  { id: "reading", name: "Reading", category: "non_negotiable", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 40, inputType: "toggle" },
  { id: "water", name: "Water", category: "non_negotiable", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 50, inputType: "counter", counterMax: 3 },

  { id: "work", name: "Work", category: "structured", weekdayBehavior: "expected", weekendBehavior: "hidden", sortOrder: 60, inputType: "toggle" },
  { id: "university", name: "University up to date", category: "structured", weekdayBehavior: "expected", weekendBehavior: "hidden", sortOrder: 70, inputType: "toggle" },
  { id: "healthy_eating", name: "Healthy eating", category: "structured", weekdayBehavior: "expected", weekendBehavior: "optional", sortOrder: 80, inputType: "toggle" },
  { id: "meditation", name: "Meditation", category: "structured", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 90, inputType: "toggle" },
  { id: "family_friends", name: "Family & friends time", category: "structured", weekdayBehavior: "optional", weekendBehavior: "expected", sortOrder: 100, inputType: "toggle" },

  { id: "smoking", name: "Smoke-free today", category: "bad", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 110, inputType: "toggle" },
  { id: "adult_content", name: "Stayed clear today", category: "bad", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 120, inputType: "toggle" },
  { id: "doom_scrolling", name: "No doom-scrolling", category: "bad", weekdayBehavior: "expected", weekendBehavior: "expected", sortOrder: 130, inputType: "toggle" },
];

export const HABITS_BY_ID = Object.fromEntries(HABITS.map((h) => [h.id, h]));

export function dayTypeFor(date: Date): DayType {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6 ? "weekend" : "weekday";
}

/**
 * University tracking is more granular than the weekday/weekend split:
 * expected on class days (Mon/Tue/Wed), and a "no overdue work" rolling
 * expectation the rest of the week. Both render as "expected" in the table —
 * this only changes the tip copy, not visibility.
 */
export function isUniversityClassDay(date: Date): boolean {
  const day = date.getDay(); // 1 = Mon, 2 = Tue, 3 = Wed
  return day >= 1 && day <= 3;
}

export function behaviorFor(habit: Habit, dayType: DayType): Behavior {
  return dayType === "weekend" ? habit.weekendBehavior : habit.weekdayBehavior;
}

export function visibleHabits(dayType: DayType): Habit[] {
  return HABITS.filter((h) => behaviorFor(h, dayType) !== "hidden").sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export const NON_NEGOTIABLE_IDS = HABITS.filter((h) => h.category === "non_negotiable").map(
  (h) => h.id
);
