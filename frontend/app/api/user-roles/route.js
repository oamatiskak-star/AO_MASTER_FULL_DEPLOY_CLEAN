import { NextResponse } from "next/server";
import { supabase } from "../config";

export async function POST(req) {
  try {
    const { user_id, email } = await req.json();

    const defaultRole = "admin";

    const { data, error } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id,
          email,
          role: defaultRole
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("USER ROLES ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ role: data.role }, { status: 200 });
  } catch (err) {
    console.error("USER ROLES ROUTE ERR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
