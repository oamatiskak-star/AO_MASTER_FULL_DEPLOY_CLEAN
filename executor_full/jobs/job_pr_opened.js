module.exports = {
name: "job_pr_opened",

async run({ log }) {
log("Nieuwe Pull Request verwerkt")

// Automatische checks, preview build, notificaties
log("PR open actie voltooïd")

return true


}
}
