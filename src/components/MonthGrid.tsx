import { Habit } from "@/lib/habits";
import { isExpected, isHidden, isAchieved, ratioForDates } from "@/lib/month";
import { ProgressBar } from "./ProgressBar";

export function MonthGrid({
  habits,
  dates,
  toISO,
  valueFor,
  today,
}: {
  habits: Habit[];
  dates: Date[];
  toISO: (d: Date) => string;
  valueFor: (habitId: string, dateISO: string) => number;
  today: Date;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-card px-2 py-1 text-left font-mono text-[10px] font-normal uppercase tracking-wide text-ink/40">
              Habit
            </th>
            {dates.map((d) => (
              <th
                key={toISO(d)}
                className="px-0.5 py-1 text-center font-mono text-[9px] font-normal text-ink/40"
              >
                {d.getDate()}
              </th>
            ))}
            <th className="px-2 py-1 text-left font-mono text-[10px] font-normal uppercase tracking-wide text-ink/40">
              Progress
            </th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => {
            const { done, goal } = ratioForDates(
              habit,
              dates,
              (iso) => valueFor(habit.id, iso),
              toISO,
              today
            );
            const percent = goal === 0 ? 0 : (done / goal) * 100;

            return (
              <tr key={habit.id} className="border-t border-line/60">
                <td className="sticky left-0 whitespace-nowrap bg-card px-2 py-1.5 font-sans text-xs text-ink">
                  {habit.name}
                </td>
                {dates.map((d) => {
                  const iso = toISO(d);
                  const value = valueFor(habit.id, iso);
                  const future = d > today;
                  const hidden = isHidden(habit, d);
                  const expected = isExpected(habit, d);
                  const achieved = isAchieved(habit, value);

                  if (hidden || future) {
                    return (
                      <td key={iso} className="px-0.5 py-1.5 text-center">
                        <div className="mx-auto h-4 w-4 rounded-sm border border-dashed border-line/50" />
                      </td>
                    );
                  }

                  return (
                    <td key={iso} className="px-0.5 py-1.5 text-center">
                      <div
                        title={habit.inputType === "counter" ? `${value}/${habit.counterMax}` : undefined}
                        className={`mx-auto flex h-4 w-4 items-center justify-center rounded-sm border font-mono text-[8px] ${
                          achieved
                            ? "border-pine bg-pine text-paper"
                            : expected
                              ? "border-line"
                              : "border-dashed border-moss/50"
                        }`}
                      >
                        {habit.inputType === "counter" && value > 0 && !achieved ? value : ""}
                      </div>
                    </td>
                  );
                })}
                <td className="px-2 py-1.5">
                  <ProgressBar percent={percent} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
