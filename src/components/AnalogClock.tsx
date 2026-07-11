"use client";

import { useEffect, useState } from "react";

export function AnalogClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now ? now.getHours() % 12 : 0;
  const minutes = now ? now.getMinutes() : 0;
  const seconds = now ? now.getSeconds() : 0;

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  // Coordinates are fixed to 3 decimals: raw floats can stringify slightly
  // differently between server and client, which trips React's hydration
  // mismatch check even though the values are mathematically identical.
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = (50 + 42 * Math.sin(angle)).toFixed(3);
    const y1 = (50 - 42 * Math.cos(angle)).toFixed(3);
    const x2 = (50 + 37 * Math.sin(angle)).toFixed(3);
    const y2 = (50 - 37 * Math.cos(angle)).toFixed(3);
    return { x1, y1, x2, y2 };
  });

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-line bg-card px-4 py-4">
      <svg viewBox="0 0 100 100" className="h-32 w-32">
        <circle cx="50" cy="50" r="47" fill="var(--paper)" stroke="var(--line)" strokeWidth="2" />
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--ink)"
            strokeOpacity="0.35"
            strokeWidth={i % 3 === 0 ? 2 : 1}
          />
        ))}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="16"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="54"
          x2="50"
          y2="14"
          stroke="var(--rust)"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondDeg} 50 50)`}
        />
        <circle cx="50" cy="50" r="2.5" fill="var(--rust)" />
      </svg>
      <span className="font-mono text-xs text-ink/60">
        {now
          ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : "--:--"}
      </span>
    </div>
  );
}
