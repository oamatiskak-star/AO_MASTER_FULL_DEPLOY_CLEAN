
export async function runJob(job){
  try{
    await job.run()
  } catch(e){
    console.error("Fout in job:", job.name, e)
  }
}
