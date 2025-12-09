import { exec } from "child_process";
import express from "express";

const app = express();
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ status: "executor online" });
});

app.listen(3000, () => {
  console.log("Executor draait op poort 3000");
});
