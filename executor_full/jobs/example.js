
import { sendTelegram } from "../handlers/notify.js"

export default async function(){
  sendTelegram("Job draait succesvol")
}
