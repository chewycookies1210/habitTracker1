import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, hashPasscode } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json();
  const expectedPasscode = process.env.APP_PASSCODE;

  if (!expectedPasscode || passcode !== expectedPasscode) {
    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  }

  const sessionValue = await hashPasscode(expectedPasscode);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return res;
}
