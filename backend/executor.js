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
const message = "Executor online";

try {
const url = "https://api.telegram.org/bot
" + token + "/sendMessage";
const r = await fetch(url, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
chat_id: chatId,
text: message
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
// Hier kan AO straks elke taak aanroepen
console.log("Uitvoeren taak:", task);

// Stuur Telegram update
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const msg = "Taak uitgevoerd: " + task;

const url = "https://api.telegram.org/bot" + token + "/sendMessage";
await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: chatId,
    text: msg
  })
});

res.json({ ok: true, executed: task });


} catch (err) {
res.json({ ok: false, error: err.toString() });
}
});

// POORT VOOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Executor draait op poort " + PORT);
});

// SELF-PING ELKE MINUUT
setInterval(() => {
fetch("https://ao-executor.onrender.com/ping
")
.then(() => console.log("Self-ping OK"))
.catch(() => console.log("Self-ping failed"));
}, 60 * 1000);
