import { success, fail } from "../controller";

export default async function handler(req, res) {
try {
if (req.method !== "POST") return fail(res, "Method not allowed", 405);

const { project_id, vermogen, fase, afstand } = req.body;
const totaal = vermogen * fase * afstand;

return success(res, {
  project_id,
  vermogen,
  fase,
  afstand,
  totaal
});


} catch (err) {
return fail(res, "Server error");
}
}