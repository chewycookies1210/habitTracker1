export const SESSION_COOKIE = "habit_session";

// SHA-256 via Web Crypto so this works in both the Edge middleware runtime
// and Node route handlers without pulling in Node's `crypto` module.
export async function hashPasscode(passcode: string): Promise<string> {
  const data = new TextEncoder().encode(passcode);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionValue(): Promise<string> {
  const passcode = process.env.APP_PASSCODE;
  if (!passcode) {
    throw new Error("APP_PASSCODE env var is not set");
  }
  return hashPasscode(passcode);
}
