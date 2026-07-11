"use client";

import { useEffect, useState } from "react";
import { toISODate, todayISO } from "@/lib/dates";
import { monthLabel } from "@/lib/month";

export function MiniCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (dateISO: string) => void;
}) {
  const selected = new Date(`${selectedDate}T00:00:00`);
  const [year, setYear] = useState(selected.getFullYear());
  const [month, setMonth] = useState(selected.getMonth() + 1); // 1-12

  // Keep the displayed month in sync when selectedDate jumps outside it
  // (e.g. crossing a month boundary via the week strip).
  useEffect(() => {
    const d = new Date(`${selectedDate}T00:00:00`);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  }, [selectedDate]);

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

  const firstOfMonth = new Date(year, month - 1, 1);
  const daysCount = new Date(year, month, 0).getDate();
  const firstWeekday = firstOfMonth.getDay(); // 0 = Sun
  const leadingBlanks = firstWeekday === 0 ? 6 : firstWeekday - 1; // Mon-first

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysCount }, (_, i) => new Date(year, month - 1, i + 1)),
  ];

  const today = todayISO();

  return (
    <div className="rounded-lg border border-line bg-card px-3 py-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="flex h-6 w-6 items-center justify-center rounded text-ink/50 hover:bg-paper hover:text-pine"
        >
          ‹
        </button>
        <span className="font-mono text-xs text-ink/70">{monthLabel(year, month)}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="flex h-6 w-6 items-center justify-center rounded text-ink/50 hover:bg-paper hover:text-pine"
        >
          ›
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="font-mono text-[9px] text-ink/40">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const iso = toISODate(d);
          const isSelected = iso === selectedDate;
          const isToday = iso === today;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(iso)}
              className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] transition ${
                isSelected
                  ? "bg-pine text-paper"
                  : isToday
                    ? "text-rust font-semibold hover:bg-paper"
                    : "text-ink/70 hover:bg-paper"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
