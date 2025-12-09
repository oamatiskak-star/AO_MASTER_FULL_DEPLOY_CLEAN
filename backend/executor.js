import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// PING
app.get("/ping", (req, res) => {
  res.json({ status: "executor online" });
});

// HEALTH
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

// STATUS
app.get("/status", (req, res) => {
  res.json({ executor: "running", timestamp: Date.now() });
});

// TELEGRAM TEST
app.get("/tg-test", async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Executor online"
      })
    });

    res.json({ sent: true });
  } catch (err) {
    res.json({ sent: false, error: err.toString() });
  }
});

// EXECUTE ENDPOINT
app.post("/execute", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Geen taak ontvangen" });
  }

  try {
    console.log("Taak uitvoeren:", task);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Taak uitgevoerd: ${task}`
      })
    });

    res.json({ ok: true, executed: task });
  } catch (err) {
    res.json({ ok: false, error: err.toString() });
  }
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Executor draait op poort " + PORT);
});

// SELF-PING
setInterval(() => {
  fetch("https://ao-executor.onrender.com/ping")
    .then(() => console.log("Self-ping OK"))
    .catch(() => console.log("Self-ping failed"));
}, 60 * 1000);
