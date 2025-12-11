export async function POST(req) {
  const body = await req.json();

  return new Response(
    JSON.stringify({
      module: "juridisch-v2",
      received: body,
      status: "processed"
    }),
    { status: 200 }
  );
}
