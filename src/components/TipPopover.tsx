"use client";

import { useState } from "react";

export function TipPopover({ tip }: { tip: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Show tip"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[10px] font-mono text-ink/50 hover:border-pine hover:text-pine"
      >
        i
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 top-7 z-20 w-56 -translate-x-1/2 rounded-md border border-line bg-card p-3 text-xs leading-relaxed text-ink shadow-md">
            {tip}
          </div>
        </>
      )}
    </div>
  );
}
