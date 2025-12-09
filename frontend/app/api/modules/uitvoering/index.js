import { success, fail } from "../controller";

export default async function handler(req, res) {
try {
if (req.method !== "POST") return fail(res, "Method not allowed", 405);

return success(res, {
  ...req.body,
  timestamp: new Date().toISOString()
});


} catch (err) {
return fail(res, "Server error");
}
}