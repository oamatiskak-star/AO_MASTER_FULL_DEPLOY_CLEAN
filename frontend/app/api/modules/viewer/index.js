import { success, fail } from "../controller";

export default async function handler(req, res) {
try {
if (req.method !== "POST") return fail(res, "Method not allowed", 405);

const { project_id, tekening } = req.body;

return success(res, {
  project_id,
  preview: "Blueprint verwerkt: " + (tekening?.length || 0) + " bytes"
});


} catch (err) {
return fail(res, "Server error");
}
}