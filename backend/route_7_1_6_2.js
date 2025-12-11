export async function POST(req) {
  const body = await req.json();
  return new Response(JSON.stringify({ module: "calc-engine-v2", body }), { status: 200 });
}
