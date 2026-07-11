import { NextRequest, NextResponse } from "next/server";
import { sendNtfy } from "@/lib/ntfy";
import { randomTip } from "@/lib/tips";
import { supabaseServer } from "@/lib/supabase";
import { NON_NEGOTIABLE_IDS } from "@/lib/habits";

const SLOTS = [
  "weekday-morning",
  "weekday-midday",
  "weekday-evening",
  "weekend-morning",
  "weekend-midday",
  "weekend-evening",
  "sunday-review",
  "nudge-check",
] as const;
type Slot = (typeof SLOTS)[number];

function todayInAppTimezone(): string {
  const tz = process.env.APP_TIMEZONE || "UTC";
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
}

async function composeMessage(slot: Slot): Promise<{ message: string; title: string } | null> {
  switch (slot) {
    case "weekday-morning":
    case "weekend-morning":
      return { title: "Morning", message: randomTip("morning") };
    case "weekday-midday":
    case "weekend-midday":
      return { title: "Midday", message: randomTip("midday") };
    case "weekday-evening":
    case "weekend-evening":
      return { title: "Evening", message: randomTip("evening") };
    case "sunday-review":
      return { title: "Weekly review", message: randomTip("sundayReview") };
    case "nudge-check": {
      const date = todayInAppTimezone();
      const sb = supabaseServer();
      const { data, error } = await sb
        .from("checkins")
        .select("habit_id, value")
        .eq("date", date)
        .in("habit_id", NON_NEGOTIABLE_IDS);
      if (error) throw new Error(error.message);

      const doneIds = new Set((data ?? []).filter((c) => c.value > 0).map((c) => c.habit_id));
      const allDone = NON_NEGOTIABLE_IDS.every((id) => doneIds.has(id));
      if (allDone) return null; // nothing to nudge about

      return { title: "Gentle nudge", message: randomTip("lapse") };
    }
  }
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const slot = req.nextUrl.searchParams.get("slot") as Slot | null;
  if (!slot || !SLOTS.includes(slot)) {
    return NextResponse.json({ error: "Unknown or missing slot" }, { status: 400 });
  }

  const composed = await composeMessage(slot);
  if (!composed) {
    return NextResponse.json({ sent: false, reason: "all non-negotiables complete" });
  }

  await sendNtfy(composed.message, { title: composed.title, tags: "seedling" });
  return NextResponse.json({ sent: true, slot });
}
