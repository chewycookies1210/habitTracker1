import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const STEP_MINUTES = 5;
const MIN_MINUTES = 5;

export async function POST(req: NextRequest) {
  const { direction } = await req.json().catch(() => ({ direction: "increase" }));
  const delta = direction === "decrease" ? -STEP_MINUTES : STEP_MINUTES;

  const sb = supabaseServer();

  const { data, error } = await sb
    .from("settings")
    .select("value")
    .eq("key", "reading_target_minutes")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const current = typeof data.value === "number" ? data.value : 15;
  const next = Math.max(MIN_MINUTES, current + delta);

  const { error: updateError } = await sb
    .from("settings")
    .update({ value: next })
    .eq("key", "reading_target_minutes");
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ reading_target_minutes: next });
}
