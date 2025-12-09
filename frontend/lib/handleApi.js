import { supabaseServer } from "./supabaseSafeServer";

export async function handleApi(callback) {
  const supabase = supabaseServer();

  if (!supabase) {
    return Response.json(
      { error: "Supabase build-safe fallback active" },
      { status: 200 }
    );
  }

  return callback(supabase);
}
