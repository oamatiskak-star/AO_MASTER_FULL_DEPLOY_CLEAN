export async function POST(req) {
  const body = await req.json();
  return new Response(JSON.stringify({ module: "architect", body }), { status: 200 });
}
