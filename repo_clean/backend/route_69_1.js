export async function POST(req) {
  const body = await req.json();
  return new Response(JSON.stringify({ module: "installatie", body }), { status: 200 });
}
