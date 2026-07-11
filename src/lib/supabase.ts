import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service role key so the browser never sees
// direct DB credentials — all reads/writes go through our own API routes,
// which is why there are no RLS policies in schema.sql.
export function supabaseServer() {
  const url = process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
