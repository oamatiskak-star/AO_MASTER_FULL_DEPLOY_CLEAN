import { BACKEND_URL } from "@/../lib/api.js"

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/api/ping`)
  const data = await res.json()
  return Response.json({ backend: data })
}
