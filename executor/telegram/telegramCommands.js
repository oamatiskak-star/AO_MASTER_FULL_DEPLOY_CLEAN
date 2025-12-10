import { sendTelegram } from "./telegram.js";

export function handleCommand(text) {
  if (text === "/status") {
    sendTelegram("AO Executor is actief.");
  }
}
