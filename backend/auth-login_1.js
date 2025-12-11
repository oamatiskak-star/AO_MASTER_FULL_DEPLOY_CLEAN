import { supabase } from "./config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: "Onjuiste inloggegevens" });
    }

    // Rol ophalen
    const { data: roleRecord, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    if (roleError) {
      return res.status(500).json({ error: "Kan rol niet ophalen" });
    }

    return res.status(200).json({
      token: data.session.access_token,
      user: data.user,
      role: roleRecord.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
