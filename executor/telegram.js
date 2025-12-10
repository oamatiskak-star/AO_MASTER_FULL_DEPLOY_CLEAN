import axios from "axios"

export async function sendTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.log("Telegram config mist")
    return
  }

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message
    })
    console.log("Telegram bericht verstuurd")
  } catch (error) {
    console.log("Fout bij Telegram verzending:", error.message)
  }
}
