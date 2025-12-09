import { supabase } from "../config";

export async function GET() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }

  return new Response(JSON.stringify({ authenticated: true, user: data.session.user }), {
    status: 200
  });
}
