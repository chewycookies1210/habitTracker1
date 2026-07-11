import { Habit } from "@/lib/habits";
import { HABIT_TIPS } from "@/lib/tips";
import { TipPopover } from "./TipPopover";
import { ToggleButton } from "./ToggleButton";
import { WaterCounter } from "./WaterCounter";
import { StreakDots } from "./StreakDots";

export function HabitRow({
  habit,
  value,
  onChange,
  optional,
  streakTrail,
  extra,
}: {
  habit: Habit;
  value: number;
  onChange: (next: number) => void;
  optional: boolean;
  streakTrail?: boolean[];
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate font-sans text-sm text-ink">{habit.name}</span>
        {optional && (
          <span className="shrink-0 rounded-full bg-moss/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-pine-dark">
            optional
          </span>
        )}
        <TipPopover tip={HABIT_TIPS[habit.id] ?? ""} />
        {streakTrail && <StreakDots trail={streakTrail} />}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {extra}
        {habit.inputType === "counter" ? (
          <WaterCounter value={value} max={habit.counterMax ?? 3} onChange={onChange} />
        ) : (
          <ToggleButton
            checked={value > 0}
            onToggle={() => onChange(value > 0 ? 0 : 1)}
            positiveLabel={habit.category === "bad" ? "✓" : "Done"}
          />
        )}
      </div>
    </div>
  );
}
