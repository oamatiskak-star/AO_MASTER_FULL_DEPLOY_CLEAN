import https from "https"

const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID

export function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    if (!token || !chatId) return resolve() // telegram optioneel

    const payload = JSON.stringify({
      chat_id: chatId,
      text: text
    })

    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    }

    const req = https.request(options, res => {
      res.on("data", () => {})
      res.on("end", resolve)
    })

    req.on("error", reject)
    req.write(payload)
    req.end()
  })
}
