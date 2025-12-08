import { supabase } from "./config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user_id, email } = req.body;

    if (!user_id || !email) {
      return res.status(400).json({ error: "user_id en email verplicht" });
    }

    // Check bestaande rol
    const { data: roles, error: roleCheckError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user_id)
      .limit(1);

    if (roleCheckError) {
      console.error("Role check error:", roleCheckError);
      return res.status(500).json({ error: "Role check error" });
    }

    if (roles && roles.length > 0) {
      return res.status(200).json({ role: roles[0].role });
    }

    // Automatische rol bepaling
    let assignedRole = "member";

    if (email === "o.amatiskak@sterkbouw.nl") {
      assignedRole = "admin";
    }

    if (email.includes("@client.")) {
      assignedRole = "client";
    }

    const { error: insertError } = await supabase
      .from("user_roles")
      .insert([{ user_id, role: assignedRole }]);

    if (insertError) {
      console.error("Insert role error:", insertError);
      return res.status(500).json({ error: "Role insert error" });
    }

    return res.status(200).json({ role: assignedRole });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
