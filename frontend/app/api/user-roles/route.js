import { handleApi } from "../../../../lib/handleApi";

export async function GET() {
  return handleApi(async (supabase) => {
    const { data, error } = await supabase
      .from("roles")
      .select("*");

    return Response.json({ data, error });
  });
}
