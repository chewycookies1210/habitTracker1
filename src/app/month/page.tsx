"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HABITS } from "@/lib/habits";
import { monthDates, monthLabel, isHidden, isAchieved, ratioForDates } from "@/lib/month";
import { toISODate } from "@/lib/dates";
import { DonutChart } from "@/components/DonutChart";
import { TrendLine } from "@/components/TrendLine";
import { MonthGrid } from "@/components/MonthGrid";

type CheckinRow = { habit_id: string; date: string; value: number };

const CATEGORY_LABELS: Record<string, string> = {
  non_negotiable: "Non-negotiables",
  structured: "Structured",
  bad: "Staying clear",
};

function daysBefore(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - n);
  return copy;
}

export default function MonthPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [rows, setRows] = useState<CheckinRow[]>([]);
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => new Date(now.getFullYear(), now.getMonth(), now.getDate()), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/month?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setRows(data.checkins ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const valueMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) map.set(`${r.habit_id}:${r.date}`, r.value);
    return map;
  }, [rows]);

  const valueFor = (habitId: string, dateISO: string) => valueMap.get(`${habitId}:${dateISO}`) ?? 0;

  const dates = useMemo(() => monthDates(year, month), [year, month]);

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  const trendValues = dates.map((d) => {
    if (d > today) return 0;
    let count = 0;
    for (const habit of HABITS) {
      if (isHidden(habit, d)) continue;
      if (isAchieved(habit, valueFor(habit.id, toISODate(d)))) count += 1;
    }
    return count;
  });

  function overallRatio(rangeDates: Date[]) {
    let done = 0;
    let goal = 0;
    for (const habit of HABITS) {
      const r = ratioForDates(habit, rangeDates, (iso) => valueFor(habit.id, iso), toISODate, today);
      done += r.done;
      goal += r.goal;
    }
    return goal === 0 ? null : (done / goal) * 100;
  }

  const monthlyPercent = overallRatio(dates);

  const last7EndDate = dates.filter((d) => d <= today).slice(-1)[0] ?? null;
  const last7Dates = last7EndDate
    ? Array.from({ length: 7 }, (_, i) => daysBefore(last7EndDate, 6 - i))
    : [];
  const last7Percent = last7EndDate ? overallRatio(last7Dates) : null;

  const grouped = {
    non_negotiable: HABITS.filter((h) => h.category === "non_negotiable"),
    structured: HABITS.filter((h) => h.category === "structured"),
    bad: HABITS.filter((h) => h.category === "bad"),
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Month view</h1>
          <p className="mt-1 font-mono text-sm text-ink/60">Visual habit tracker</p>
        </div>
        <Link
          href="/"
          className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-ink/70 hover:border-pine hover:text-pine"
        >
          Day view
        </Link>
      </header>

      <div className="flex items-center justify-between rounded-lg border border-line bg-card px-3 py-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-md text-ink/50 hover:bg-paper hover:text-pine"
        >
          ‹
        </button>
        <span className="font-serif text-lg text-ink">{monthLabel(year, month)}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-md text-ink/50 hover:bg-paper hover:text-pine"
        >
          ›
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-center font-mono text-sm text-ink/40">Loading…</p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 rounded-lg border border-line bg-card px-4 py-5">
            <DonutChart
              percent={monthlyPercent ?? 0}
              label="Monthly progress"
              color="var(--pine)"
            />
            <DonutChart
              percent={last7Percent ?? 0}
              label="Last 7 days momentum"
              color="var(--rust)"
            />
          </div>

          <section className="mt-6 rounded-lg border border-line bg-card px-4 py-4">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/50">
              Daily completions
            </h2>
            <TrendLine values={trendValues} />
          </section>

          {(["non_negotiable", "structured", "bad"] as const).map((category) => (
            <section key={category} className="mt-6">
              <h2 className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="rounded-lg border border-line bg-card py-2">
                <MonthGrid
                  habits={grouped[category]}
                  dates={dates}
                  toISO={toISODate}
                  valueFor={valueFor}
                  today={today}
                />
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}
