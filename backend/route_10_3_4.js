export async function GET() {
  return new Response(JSON.stringify({ status: "uren ok" }), { status: 200 });
}
