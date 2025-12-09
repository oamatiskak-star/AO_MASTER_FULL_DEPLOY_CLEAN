import { supabase } from "./config";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (id) {
      // één project ophalen
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data);
    }

    // alle projecten ophalen
    const { data, error } = await supabase.from("projects").select("*");

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
