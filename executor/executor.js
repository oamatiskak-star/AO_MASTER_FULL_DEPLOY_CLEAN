import fetch from "node-fetch";
import { sendTelegram } from "./telegram/telegram.js";
import { handleCommand } from "./telegram/telegramCommands.js";

const BACKEND_URL = process.env.BACKEND_URL;

// ----------------------------
// SELF-PING LOOP
// ----------------------------
async function pingBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ping`);
    const json = await res.json();

    console.log("Backend ping:", json);
  } catch (err) {
    console.log("Ping fout:", err.message);
  }
}

// elke 10 sec ping
setInterval(pingBackend, 10000);

// ----------------------------
// TELEGRAM OPSTART BERICHT
// ----------------------------
sendTelegram("AO Executor gestart en verbonden met backend.");

console.log("AO Executor draait...");
