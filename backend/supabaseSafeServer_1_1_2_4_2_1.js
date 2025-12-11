import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Tijdens build ontbreken deze → crash voorkomen
  if (!url || !(anon || service)) {
    return null;
  }

  return createClient(url, service || anon, {
    auth: { persistSession: false },
  });
}
