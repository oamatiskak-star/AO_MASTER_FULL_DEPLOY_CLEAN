import { supabase } from "../config";

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, email } = body;

    if (!user_id) {
      return new Response(JSON.stringify({
        error: "user_id ontbreekt"
      }), { status: 400 });
    }

    // Check of user al een rol heeft
    const { data: existing, error: fetchErr } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (existing) {
      return new Response(JSON.stringify({
        role: existing.role
      }), { status: 200 });
    }

    // Nieuwe rol toevoegen
    const { data: insertData, error: insertErr } = await supabase
      .from("user_roles")
      .insert([
        {
          user_id,
          role: "admin",
        }
      ])
      .select()
      .single();

    if (insertErr) {
      return new Response(JSON.stringify({
        error: insertErr.message
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      role: insertData.role
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), { status: 500 });
  }
}
