export async function sendTask(task) {
  const res = await fetch("/api/executor/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task })
  })

  return await res.json()
}

export async function getStatus() {
  const res = await fetch("/api/executor/status")
  return await res.json()
}
