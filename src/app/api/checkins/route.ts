import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { HABITS_BY_ID } from "@/lib/habits";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: NextRequest) {
  const { habitId, date, value } = await req.json();

  const habit = HABITS_BY_ID[habitId];
  if (!habit) {
    return NextResponse.json({ error: "Unknown habit" }, { status: 400 });
  }
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const max = habit.inputType === "counter" ? habit.counterMax ?? 3 : 1;
  if (typeof value !== "number" || value < 0 || value > max || !Number.isInteger(value)) {
    return NextResponse.json({ error: `value must be an integer 0-${max}` }, { status: 400 });
  }

  const sb = supabaseServer();
  const { error } = await sb
    .from("checkins")
    .upsert({ habit_id: habitId, date, value }, { onConflict: "habit_id,date" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
