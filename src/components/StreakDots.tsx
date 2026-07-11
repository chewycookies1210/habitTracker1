export function StreakDots({ trail }: { trail: boolean[] }) {
  return (
    <div className="flex items-center gap-1">
      {trail.map((hit, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${hit ? "bg-moss" : "bg-line"}`}
        />
      ))}
    </div>
  );
}
