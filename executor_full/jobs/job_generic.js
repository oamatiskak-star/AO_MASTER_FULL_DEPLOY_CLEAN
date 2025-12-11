module.exports = {
name: "job_generic",

async run({ log }) {
log("GENERIC job → fallback voor alle overige GitHub events")

return true


}
}
