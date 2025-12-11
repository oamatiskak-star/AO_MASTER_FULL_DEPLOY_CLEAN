export async function GET() {
  return new Response(JSON.stringify({ status: "uitvoering ok" }), { status: 200 });
}
