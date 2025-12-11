export async function GET() {
  return new Response(JSON.stringify({ viewer: true }), { status: 200 });
}
