import { exec } from "child_process";
import express from "express";

const app = express();
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ status: "executor online" });
});

// Render gebruikt een dynamische poort via process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Executor draait op poort " + PORT);
});
