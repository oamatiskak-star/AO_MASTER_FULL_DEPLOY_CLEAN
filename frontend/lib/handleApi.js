export async function handleApi(callback) {
  try {
    const { createClient } = await import("@supabase/supabase-js")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const result = await callback(supabase)
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
