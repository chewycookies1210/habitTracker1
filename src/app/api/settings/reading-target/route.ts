import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const STEP_MINUTES = 5;

export async function POST() {
  const sb = supabaseServer();

  const { data, error } = await sb
    .from("settings")
    .select("value")
    .eq("key", "reading_target_minutes")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const current = typeof data.value === "number" ? data.value : 15;
  const next = current + STEP_MINUTES;

  const { error: updateError } = await sb
    .from("settings")
    .update({ value: next })
    .eq("key", "reading_target_minutes");
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ reading_target_minutes: next });
}
