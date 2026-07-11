export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-pine" style={{ width: `${clamped}%` }} />
      </div>
      <span className="w-9 shrink-0 font-mono text-xs text-ink/60">{Math.round(clamped)}%</span>
    </div>
  );
}
