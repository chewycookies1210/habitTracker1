// Uses local calendar-date components, not toISOString() (which is UTC and
// would show tomorrow's date for hours each evening in negative-UTC-offset
// timezones like Central America).
export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Mon-Sun days of the week containing `dateISO`. */
export function weekDays(dateISO: string): Date[] {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.getDay(); // 0 = Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

export function formatDayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDateLong(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
