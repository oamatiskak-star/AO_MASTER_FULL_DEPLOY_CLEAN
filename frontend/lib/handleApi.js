import { supabaseServer } from "./supabaseSafeServer";

export async function handleApi(callback) {
  const supabase = supabaseServer();

  // Als we in build zitten → supabase = null → geen crash
  if (!supabase) {
    return Response.json(
      { error: "Supabase not initialized (build-safe fallback)" },
      { status: 200 }
    );
  }

  return callback(supabase);
}
