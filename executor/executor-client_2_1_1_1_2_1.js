import fetch from "node-fetch";

const EXECUTOR_URL = process.env.EXECUTOR_URL || "https://ao-executor.onrender.com";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

// --------------------------------------------
// TELEGRAM LOGGING
// --------------------------------------------
export async function logToTelegram(message) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) return;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT,
        text: message
      })
    });
  } catch (err) {
    console.log("Telegram fout:", err.toString());
  }
}

// --------------------------------------------
// EXECUTOR HEALTH
// --------------------------------------------
export async function executorHealth() {
  try {
    const r = await fetch(`${EXECUTOR_URL}/health`);
    const data = await r.json();

    await logToTelegram("AO → Executor HEALTH OK");

    return data;
  } catch (err) {
    await logToTelegram("AO → Executor HEALTH FAILED: " + err.toString());
    throw err;
  }
}

// --------------------------------------------
// EXECUTOR STATUS
// --------------------------------------------
export async function executorStatus() {
  try {
    const r = await fetch(`${EXECUTOR_URL}/status`);
    const data = await r.json();

    await logToTelegram("AO → Executor STATUS OK");

    return data;
  } catch (err) {
    await logToTelegram("AO → Executor STATUS FAILED: " + err.toString());
    throw err;
  }
}

// --------------------------------------------
// EXECUTE TASK
// --------------------------------------------
export async function sendTaskToExecutor(task) {
  await logToTelegram("AO → Executor: taak versturen → " + task);

  try {
    const r = await fetch(`${EXECUTOR_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task })
    });

    const data = await r.json();

    await logToTelegram("AO → Executor: taak uitgevoerd → " + JSON.stringify(data));

    return data;
  } catch (err) {
    await logToTelegram("AO → Executor: EXECUTE FAILED: " + err.toString());
    throw err;
  }
}
