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

    // bepaal rol automatisch
    const assignedRole = email === "o.amatiskak@sterkbouw.nl"
      ? "admin"
      : "member";

    // user-role API aanroepen met geldige role
    const roleRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: data.user.id,
        role: assignedRole
      })
    });

    const roleData = await roleRes.json();

    return res.status(200).json({
      token: data.session.access_token,
      user: data.user,
      role: roleData.role || assignedRole
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
