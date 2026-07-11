export function WaterCounter({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} of ${max}`}
            onClick={() => onChange(filled && n === value ? n - 1 : n)}
            className={`h-6 w-6 rounded-full border transition ${
              filled ? "border-pine bg-pine" : "border-line bg-card hover:border-pine"
            }`}
          />
        );
      })}
      <span className="ml-1 font-mono text-xs text-ink/50">
        {value}/{max}
      </span>
    </div>
  );
}
