export async function sendNtfy(
  message: string,
  opts: { title?: string; tags?: string } = {}
): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) throw new Error("NTFY_TOPIC env var is not set");

  const res = await fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...(opts.title ? { Title: opts.title } : {}),
      ...(opts.tags ? { Tags: opts.tags } : {}),
    },
    body: message,
  });

  if (!res.ok) {
    throw new Error(`ntfy request failed: ${res.status} ${await res.text()}`);
  }
}
