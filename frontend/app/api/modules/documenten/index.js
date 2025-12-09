import { success, fail } from "../controller";

export default async function handler(req, res) {
try {
if (req.method !== "POST") return fail(res, "Method not allowed", 405);

const { project_id, titel } = req.body;

return success(res, {
  project_id,
  file_name: titel.replace(/\s+/g, "_") + ".pdf",
  saved: true
});


} catch (err) {
return fail(res, "Server error");
}
}