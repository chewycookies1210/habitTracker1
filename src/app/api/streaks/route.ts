import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { NON_NEGOTIABLE_IDS } from "@/lib/habits";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TRAIL_LENGTH = 7;

function isoDaysBefore(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date (YYYY-MM-DD)" }, { status: 400 });
  }

  const startDate = isoDaysBefore(date, TRAIL_LENGTH - 1);
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("checkins")
    .select("habit_id, date, value")
    .in("habit_id", NON_NEGOTIABLE_IDS)
    .gte("date", startDate)
    .lte("date", date);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const trails: Record<string, boolean[]> = {};
  for (const id of NON_NEGOTIABLE_IDS) {
    trails[id] = Array.from({ length: TRAIL_LENGTH }, (_, i) => {
      const day = isoDaysBefore(date, TRAIL_LENGTH - 1 - i);
      const row = (data ?? []).find((r) => r.habit_id === id && r.date === day);
      return !!row && row.value > 0;
    });
  }

  return NextResponse.json({ trails });
}
