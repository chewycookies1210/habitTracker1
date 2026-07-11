export function TrendLine({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const width = Math.max(320, values.length * 24);
  const height = 90;
  const padTop = 18;
  const padBottom = 14;
  const plotHeight = height - padTop - padBottom;

  const points = values.map((v, i) => {
    const x = values.length === 1 ? width / 2 : (i / (values.length - 1)) * width;
    const y = padTop + plotHeight - (v / max) * plotHeight;
    return { x, y, v };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="block">
        <path d={path} fill="none" stroke="var(--pine)" strokeWidth="2" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill="var(--pine)" />
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="font-mono"
              fontSize="9"
              fill="var(--ink)"
              opacity="0.6"
            >
              {p.v}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
