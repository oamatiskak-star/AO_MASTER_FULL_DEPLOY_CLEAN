import { handleApi } from "../../../lib/handleApi"

export async function GET() {
  return handleApi(async (supabase) => {

    const { data, error } = await supabase
      .from("user_roles")
      .select("*")

    if (error) {
      return { ok: false, error: error.message }
    }

    return { ok: true, roles: data }
  })
}
