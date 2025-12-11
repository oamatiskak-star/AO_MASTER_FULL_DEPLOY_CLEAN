export async function runModule(task) {
  return {
    ok: true,
    message: "Module uitgevoerd",
    task,
    timestamp: Date.now()
  }
}
