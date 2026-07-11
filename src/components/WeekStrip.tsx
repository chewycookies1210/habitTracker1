"use client";

import { weekDays, formatDayLabel, toISODate, todayISO } from "@/lib/dates";

export function WeekStrip({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (dateISO: string) => void;
}) {
  const days = weekDays(selectedDate);
  const today = todayISO();

  function shiftWeek(deltaDays: number) {
    const d = new Date(`${selectedDate}T00:00:00`);
    d.setDate(d.getDate() + deltaDays);
    onSelect(toISODate(d));
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-line bg-card p-1.5">
      <button
        type="button"
        onClick={() => shiftWeek(-7)}
        aria-label="Previous week"
        className="flex h-8 w-6 shrink-0 items-center justify-center rounded-md text-ink/50 hover:bg-paper hover:text-pine"
      >
        ‹
      </button>
      <div className="flex flex-1 justify-between gap-1">
      {days.map((d) => {
        const iso = toISODate(d);
        const isSelected = iso === selectedDate;
        const isToday = iso === today;
        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className={`flex flex-1 flex-col items-center rounded-md px-2 py-1.5 font-mono text-xs transition ${
              isSelected
                ? "bg-pine text-paper"
                : "text-ink/70 hover:bg-paper"
            }`}
          >
            <span className="uppercase tracking-wide">{formatDayLabel(d)}</span>
            <span className={`mt-0.5 text-sm ${isToday && !isSelected ? "text-rust font-semibold" : ""}`}>
              {d.getDate()}
            </span>
          </button>
        );
      })}
      </div>
      <button
        type="button"
        onClick={() => shiftWeek(7)}
        aria-label="Next week"
        className="flex h-8 w-6 shrink-0 items-center justify-center rounded-md text-ink/50 hover:bg-paper hover:text-pine"
      >
        ›
      </button>
    </div>
  );
}
