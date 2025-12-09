import express from "express";

// Basis setup
const app = express();
app.use(express.json());

// PING ROUTE
app.get("/ping", (req, res) => {
  res.json({ status: "executor online" });
});

// Render dynamische poort
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Executor draait op poort " + PORT);
});

// SELF-PING elke minuut om Render wakker te houden
setInterval(() => {
  // Node 18+ heeft native fetch
  fetch("https://ao-executor.onrender.com/ping")
    .then(() => console.log("Self-ping OK"))
    .catch(() => console.log("Self-ping failed"));
}, 60 * 1000); // 1 minuut
