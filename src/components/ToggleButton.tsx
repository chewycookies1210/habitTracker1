export function ToggleButton({
  checked,
  onToggle,
  positiveLabel = "Done",
}: {
  checked: boolean;
  onToggle: () => void;
  positiveLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex h-8 w-20 items-center justify-center rounded-md font-mono text-xs font-medium transition ${
        checked
          ? "bg-pine text-paper"
          : "border border-line bg-card text-ink/50 hover:border-pine hover:text-pine"
      }`}
    >
      {checked ? positiveLabel : "—"}
    </button>
  );
}
