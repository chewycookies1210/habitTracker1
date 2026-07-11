"use client";

import { useEffect, useMemo, useState } from "react";
import {
  visibleHabits,
  behaviorFor,
  dayTypeFor,
  isUniversityClassDay,
} from "@/lib/habits";
import { randomTip, TipPoolName } from "@/lib/tips";
import { todayISO, formatDateLong } from "@/lib/dates";
import { WeekStrip } from "@/components/WeekStrip";
import { HabitRow } from "@/components/HabitRow";

type DayResponse = {
  date: string;
  checkins: Record<string, number>;
  settings: Record<string, unknown>;
};

type StreaksResponse = {
  trails: Record<string, boolean[]>;
};

function timeOfDayPool(): TipPoolName {
  const hour = new Date().getHours();
  if (hour < 11) return "morning";
  if (hour < 17) return "midday";
  return "evening";
}

const CATEGORY_LABELS: Record<string, string> = {
  non_negotiable: "Non-negotiables",
  structured: "Structured",
  bad: "Staying clear",
};

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [day, setDay] = useState<DayResponse | null>(null);
  const [trails, setTrails] = useState<StreaksResponse["trails"]>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerTip, setBannerTip] = useState("");

  // Picked client-side only (after mount) since it's randomized and would
  // otherwise mismatch between the server-rendered and hydrated markup.
  useEffect(() => {
    setBannerTip(randomTip(timeOfDayPool()));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/day?date=${selectedDate}`).then((r) => r.json()),
      fetch(`/api/streaks?date=${selectedDate}`).then((r) => r.json()),
    ])
      .then(([dayRes, streaksRes]) => {
        if (cancelled) return;
        if (dayRes.error) {
          setError(dayRes.error);
          setDay(null);
        } else {
          setDay(dayRes);
          setTrails(streaksRes.trails ?? {});
        }
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const dayType = useMemo(() => dayTypeFor(new Date(`${selectedDate}T00:00:00`)), [selectedDate]);
  const habits = useMemo(() => visibleHabits(dayType), [dayType]);
  const isClassDay = useMemo(
    () => isUniversityClassDay(new Date(`${selectedDate}T00:00:00`)),
    [selectedDate]
  );

  async function setValue(habitId: string, value: number) {
    setDay((prev) =>
      prev ? { ...prev, checkins: { ...prev.checkins, [habitId]: value } } : prev
    );
    await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, date: selectedDate, value }),
    });
  }

  async function adjustReadingTarget(direction: "increase" | "decrease") {
    const res = await fetch("/api/settings/reading-target", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    const data = await res.json();
    setDay((prev) =>
      prev
        ? { ...prev, settings: { ...prev.settings, reading_target_minutes: data.reading_target_minutes } }
        : prev
    );
  }

  const readingTarget =
    typeof day?.settings.reading_target_minutes === "number"
      ? day.settings.reading_target_minutes
      : 15;

  const grouped = {
    non_negotiable: habits.filter((h) => h.category === "non_negotiable"),
    structured: habits.filter((h) => h.category === "structured"),
    bad: habits.filter((h) => h.category === "bad"),
  };

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
      <header className="mb-5">
        <h1 className="font-serif text-3xl font-semibold text-ink">Habit Tracker</h1>
        <p className="mt-1 font-mono text-sm text-ink/60">{formatDateLong(selectedDate)}</p>
      </header>

      <WeekStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

      <div className="mt-4 rounded-lg border border-line bg-card px-4 py-3 text-sm leading-relaxed text-ink/80">
        {bannerTip}
      </div>

      {error ? (
        <p className="mt-8 text-center font-mono text-sm text-rust">{error}</p>
      ) : loading || !day ? (
        <p className="mt-8 text-center font-mono text-sm text-ink/40">Loading…</p>
      ) : (
        (["non_negotiable", "structured", "bad"] as const).map((category) => {
          const items = grouped[category];
          if (items.length === 0) return null;
          return (
            <section key={category} className="mt-6">
              <h2 className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="rounded-lg border border-line bg-card px-4">
                {items.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    value={day.checkins[habit.id] ?? 0}
                    onChange={(v) => setValue(habit.id, v)}
                    optional={behaviorFor(habit, dayType) === "optional"}
                    streakTrail={category === "non_negotiable" ? trails[habit.id] : undefined}
                    extra={
                      habit.id === "reading" ? (
                        <div className="flex items-center gap-2 font-mono text-xs text-ink/60">
                          <span>{readingTarget}m target</span>
                          <button
                            type="button"
                            onClick={() => adjustReadingTarget("decrease")}
                            disabled={readingTarget <= 5}
                            className="rounded border border-line px-1.5 py-0.5 hover:border-pine hover:text-pine disabled:opacity-40"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustReadingTarget("increase")}
                            className="rounded border border-line px-1.5 py-0.5 hover:border-pine hover:text-pine"
                          >
                            +5
                          </button>
                        </div>
                      ) : habit.id === "university" && isClassDay ? (
                        <span className="font-mono text-[10px] uppercase tracking-wide text-rust">
                          class day
                        </span>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
