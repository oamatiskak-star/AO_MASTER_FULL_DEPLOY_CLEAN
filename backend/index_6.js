import { supabase } from "../../config";
import { success, fail } from "../controller";

export default async function handler(req, res) {
try {
if (req.method === "GET") {
const { data, error } = await supabase
.from("calculations")
.select("*");

  if (error) return fail(res, error.message);
  return success(res, data);
}

if (req.method === "POST") {
  const { data, error } = await supabase
    .from("calculations")
    .insert(req.body)
    .select();

  if (error) return fail(res, error.message);
  return success(res, data);
}

return fail(res, "Method not allowed", 405);


} catch (err) {
return fail(res, "Server error");
}
}