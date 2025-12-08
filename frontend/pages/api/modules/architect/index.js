import { supabase } from "../../config";
import { success, fail } from "../controller";

export default async function handler(req, res) {
try {
if (req.method !== "POST") return fail(res, "Method not allowed", 405);

const { project_id, parameters } = req.body;

const { data, error } = await supabase
  .from("architect_engine")
  .insert({ project_id, parameters })
  .select();

if (error) return fail(res, error.message);
return success(res, data);


} catch (err) {
return fail(res, "Server error");
}
}