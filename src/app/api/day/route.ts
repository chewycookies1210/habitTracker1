import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date (YYYY-MM-DD)" }, { status: 400 });
  }

  const sb = supabaseServer();

  const [{ data: checkins, error: checkinsError }, { data: settingsRows, error: settingsError }] =
    await Promise.all([
      sb.from("checkins").select("habit_id, value").eq("date", date),
      sb.from("settings").select("key, value"),
    ]);

  if (checkinsError) return NextResponse.json({ error: checkinsError.message }, { status: 500 });
  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 });

  const settings = Object.fromEntries((settingsRows ?? []).map((s) => [s.key, s.value]));

  return NextResponse.json({
    date,
    checkins: Object.fromEntries((checkins ?? []).map((c) => [c.habit_id, c.value])),
    settings,
  });
}
