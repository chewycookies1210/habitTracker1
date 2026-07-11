import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { daysInMonth } from "@/lib/month";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month")); // 1-12

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid or missing year/month" }, { status: 400 });
  }

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
    daysInMonth(year, month)
  ).padStart(2, "0")}`;

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("checkins")
    .select("habit_id, date, value")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ checkins: data ?? [] });
}
