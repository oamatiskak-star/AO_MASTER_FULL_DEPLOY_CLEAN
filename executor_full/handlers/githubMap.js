export function mapGithubToJob(event, payload) {
// Push naar main
if (event === "push") {
if (payload?.ref === "refs/heads/main") {
return "job_build_main"
}
}

// Nieuwe branch
if (event === "create" && payload?.ref_type === "branch") {
return "job_new_branch"
}

// PR’s
if (event === "pull_request") {
if (payload?.action === "opened") return "job_pr_opened"
if (payload?.action === "closed") return "job_pr_closed"
if (payload?.action === "merged") return "job_pr_merged"
}

// Workflow jobs
if (event === "workflow_job") {
if (payload?.action === "completed") return "job_workflow_completed"
}

// Algemeen fallback job
return "job_generic"
}
