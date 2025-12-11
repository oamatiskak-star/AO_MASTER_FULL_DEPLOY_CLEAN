module.exports = {
name: "job_workflow_completed",

async run({ log }) {
log("GitHub workflow afgerond")

// Bijvoorbeeld: status terugkoppeling, slack, telegram
log("Workflow verwerking klaar")

return true


}
}
