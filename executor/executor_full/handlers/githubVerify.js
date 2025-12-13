import crypto from "crypto"

export function verifySignature(req, secret) {
if (!secret) return true

const signature = req.headers["x-hub-signature-256"]
if (!signature) return false

const hmac = crypto
.createHmac("sha256", secret)
.update(JSON.stringify(req.body), "utf8")
.digest("hex")

return signature === sha256=${hmac}
}
