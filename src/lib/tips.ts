export const TIP_POOLS = {
  morning: [
    "Anchor it: right after you silence the alarm, start the routine before anything else touches your hands.",
    "If today feels heavy, shrink the routine to its smallest version. Showing up beats doing it perfectly.",
    "Water bottle one: keep it closer than your phone tonight, so it's the easier reach tomorrow.",
    "15 minutes of reading is the whole goal right now, not the minimum. Don't let it creep up until it feels automatic.",
    "The phone-free window isn't about willpower — it's about not giving the loop a chance to start today.",
  ],
  midday: [
    "Second bottle before lunch — thirst often masquerades as a snack craving.",
    "If a scrolling urge hits, this is the bounded window: one intentional check, not an all-day rabbit hole.",
    "Ten minutes with course material today keeps momentum alive, even on a light day.",
  ],
  evening: [
    "Phone-free wind-down starts now. The goal is a consistent night, not a perfect one.",
    "Meditation doesn't need to be long to count — five slow breaths still counts as showing up.",
    "Bonus round: even a five-minute call to family or a friend moves today from fine to good.",
  ],
  lapse: [
    "A slip is data, not a verdict. What was happening right before it? Worth a note for Sunday's review.",
    "Self-criticism tends to fuel the next slip more than it prevents it. Notice, reset, move to the next block.",
    "One missed day doesn't erase the rest of the week. Non-negotiables are the floor — they're built to survive a bad day.",
  ],
  sundayReview: [
    "Quick look back: which non-negotiable held up easiest this week? Which one needs a smaller version?",
    "Streaks are information, not a scoreboard. What does this week tell you about where the friction really is?",
  ],
} as const;

export type TipPoolName = keyof typeof TIP_POOLS;

export function randomTip(pool: TipPoolName): string {
  const options = TIP_POOLS[pool];
  return options[Math.floor(Math.random() * options.length)];
}

/** Per-habit contextual tip shown behind the inline tip icon in the table. */
export const HABIT_TIPS: Record<string, string> = {
  morning_routine: "Anchor it: right after you silence the alarm, start the routine before anything else touches your hands.",
  phoneless_morning: "The phone-free window isn't about willpower — it's about not giving the loop a chance to start today.",
  phoneless_evening: "Phone-free wind-down starts now. The goal is a consistent night, not a perfect one.",
  reading: "15 minutes is the whole goal right now, not the minimum. Don't let it creep up until it feels automatic.",
  water: "Thirst often masquerades as a snack craving — keep the bottle closer than your phone.",
  work: "Structured on weekdays, hidden on weekends — no guilt for not working on your day off.",
  university: "Expected Mon/Tue/Wed (class days). Other days: just keep nothing overdue.",
  healthy_eating: "Expected on weekdays, bonus on weekends — flexibility is the point, not the exception.",
  meditation: "Morning or evening, your choice — one toggle either way. Five slow breaths still counts.",
  family_friends: "Bonus on weekdays, expected on weekends — this is where it's meant to concentrate.",
  smoking: "Framed as what you're protecting, not what you're avoiding.",
  adult_content: "Staying clear is the win. No streaks reset to zero here, just today's choice.",
  doom_scrolling: "Paired with one bounded, intentional scroll window rather than a zero-tolerance rule — all-or-nothing restriction tends to backfire.",
};
