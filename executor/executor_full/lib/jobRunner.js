export async function runJob(job) {
  console.log("Start job:", job.name)

  const log = (msg) => console.log(`[${job.name}] ${msg}`)

  try {
    await job.run(log)
  } catch (err) {
    console.log("Fout in job:", job.name, err)
  }

  console.log("Klaar:", job.name)
}
