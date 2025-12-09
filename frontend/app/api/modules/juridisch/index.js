import { success, fail } from "../controller";

export default async function handler(req, res) {
try {
if (req.method !== "POST") return fail(res, "Method not allowed", 405);

const { project_id, vraag } = req.body;
const advies = "Automatisch juridisch advies: " + vraag;

return success(res, {
  project_id,
  vraag,
  advies
});


} catch (err) {
return fail(res, "Server error");
}
}