export function DonutChart({
  percent,
  label,
  color = "var(--pine)",
}: {
  percent: number;
  label: string;
  color?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--line)" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold text-ink">
          {Math.round(clamped)}%
        </div>
      </div>
      <span className="text-center font-mono text-[11px] uppercase tracking-wide text-ink/50">
        {label}
      </span>
    </div>
  );
}
