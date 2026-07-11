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

  return (
    <div className="flex justify-between gap-1 rounded-lg border border-line bg-card p-1.5">
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
  );
}
